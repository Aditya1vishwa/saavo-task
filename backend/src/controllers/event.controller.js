import EventModel from "../db/mongodb/models/event.model.js";
import EventTicketTypeModel from "../db/mongodb/models/eventTicketType.model.js";
import EventSeatModel from "../db/mongodb/models/eventSeat.model.js";
import VenueModel from "../db/mongodb/models/venue.model.js";
import VenueSeatModel from "../db/mongodb/models/venueSeat.model.js";
import TicketModel from "../db/mongodb/models/ticket.model.js";
import BookingModel from "../db/mongodb/models/booking.model.js";
import uploadHelper from "../helpers/Upload.js";

const toPositiveInt = (value, fallback = 10) => {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const isAdmin = (req) => req.user?.role === "admin";

// Organizers manage only their own events; admins manage any.
const ownerFilter = (req, extra = {}) =>
    isAdmin(req) ? { ...extra } : { ...extra, organizerId: req.user._id };

const normalizeTicketTypes = (raw) => {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((t) => t && t.name && t.price !== undefined)
        .map((t) => ({
            name: String(t.name).trim(),
            category: String(t.category || "").trim(),
            price: Math.max(Number(t.price) || 0, 0),
            currency: t.currency || "INR",
            totalQuantity: Math.max(Number(t.totalQuantity) || 0, 0),
            availableQuantity: Math.max(Number(t.totalQuantity) || 0, 0),
            color: t.color || "#2563eb",
        }));
};

const computeMinPrice = (ticketTypes) =>
    ticketTypes.length ? Math.min(...ticketTypes.map((t) => t.price)) : 0;

// ─── Organizer: create / update / publish / delete ────────────────────────────

const createEvent = async (req, res, next) => {
    try {
        const { title, venueId, startAt } = req.body || {};
        if (!title || !String(title).trim()) {
            return res.status(400).json({ success: false, message: "Event title is required" });
        }
        if (!venueId) {
            return res.status(400).json({ success: false, message: "venueId is required" });
        }
        if (!startAt) {
            return res.status(400).json({ success: false, message: "startAt is required" });
        }

        // Venue must exist and (for organizers) be owned by the requester.
        const venue = await VenueModel.findOne(
            isAdmin(req) ? { _id: venueId } : { _id: venueId, createdBy: req.user._id }
        );
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found or not owned by you" });
        }

        const ticketTypes = normalizeTicketTypes(req.body.ticketTypes);

        const event = await EventModel.create({
            title: String(title).trim(),
            description: req.body.description || "",
            organizerId: req.user._id,
            venueId: venue._id,
            city: venue.city,
            category: String(req.body.category || "Other").trim(),
            tags: Array.isArray(req.body.tags) ? req.body.tags : [],
            bannerUrl: req.body.bannerUrl || "",
            startAt: new Date(startAt),
            endAt: req.body.endAt ? new Date(req.body.endAt) : undefined,
            minPrice: computeMinPrice(ticketTypes),
            status: "draft",
        });

        let createdTypes = [];
        if (ticketTypes.length) {
            createdTypes = await EventTicketTypeModel.insertMany(
                ticketTypes.map((t) => ({ ...t, eventId: event._id }))
            );
        }

        return res.status(201).json({ success: true, data: { event, ticketTypes: createdTypes }, message: "Event created" });
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id }));
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const payload = req.body || {};
        ["title", "description", "category", "tags", "bannerUrl"].forEach((f) => {
            if (payload[f] !== undefined) event[f] = payload[f];
        });
        if (payload.startAt) event.startAt = new Date(payload.startAt);
        if (payload.endAt) event.endAt = new Date(payload.endAt);

        // Allow changing venue only while still a draft (seat inventory depends on it).
        if (payload.venueId && String(payload.venueId) !== String(event.venueId)) {
            if (event.status !== "draft") {
                return res.status(409).json({ success: false, message: "Venue can only be changed on a draft event" });
            }
            const venue = await VenueModel.findOne(
                isAdmin(req) ? { _id: payload.venueId } : { _id: payload.venueId, createdBy: req.user._id }
            );
            if (!venue) {
                return res.status(404).json({ success: false, message: "Venue not found or not owned by you" });
            }
            event.venueId = venue._id;
            event.city = venue.city;
            event.seatsGenerated = false;
            await EventSeatModel.deleteMany({ eventId: event._id });
        }

        // Replace ticket types if provided (only when no seats generated yet).
        if (Array.isArray(payload.ticketTypes)) {
            if (event.seatsGenerated) {
                return res.status(409).json({ success: false, message: "Cannot change ticket types after seats are generated" });
            }
            const types = normalizeTicketTypes(payload.ticketTypes);
            await EventTicketTypeModel.deleteMany({ eventId: event._id });
            if (types.length) {
                await EventTicketTypeModel.insertMany(types.map((t) => ({ ...t, eventId: event._id })));
            }
            event.minPrice = computeMinPrice(types);
        }

        await event.save();
        const ticketTypes = await EventTicketTypeModel.find({ eventId: event._id });
        return res.status(200).json({ success: true, data: { event, ticketTypes }, message: "Event updated" });
    } catch (error) {
        next(error);
    }
};

// Clone the venue's seat layout into per-event inventory, pricing each seat
// from the ticket type whose `category` matches the seat's category.
const generateEventSeats = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id }));
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const venue = await VenueModel.findById(event.venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        if (venue.layoutType !== "seated") {
            return res.status(400).json({ success: false, message: "Seat generation only applies to seated venues" });
        }

        // Guard: don't regenerate over booked/locked inventory.
        const inUse = await EventSeatModel.countDocuments({ eventId: event._id, status: { $ne: "available" } });
        if (inUse > 0) {
            return res.status(409).json({ success: false, message: "Seats are already booked or locked; cannot regenerate" });
        }

        const [venueSeats, ticketTypes] = await Promise.all([
            VenueSeatModel.find({ venueId: venue._id }),
            EventTicketTypeModel.find({ eventId: event._id }),
        ]);

        if (!venueSeats.length) {
            return res.status(400).json({ success: false, message: "Venue has no seat layout" });
        }
        if (!ticketTypes.length) {
            return res.status(400).json({ success: false, message: "Define ticket types before generating seats" });
        }

        const typeByCategory = new Map(ticketTypes.map((t) => [t.category, t]));
        const unmapped = new Set();
        const docs = venueSeats.map((vs) => {
            const t = typeByCategory.get(vs.category);
            if (!t) unmapped.add(vs.category);
            return {
                eventId: event._id,
                venueSeatId: vs._id,
                ticketTypeId: t?._id || null,
                section: vs.section,
                row: vs.row,
                seatNumber: vs.seatNumber,
                category: vs.category,
                price: t?.price || 0,
                status: "available",
            };
        });

        if (unmapped.size) {
            return res.status(400).json({
                success: false,
                message: `No ticket type maps to seat categories: ${[...unmapped].join(", ")}`,
            });
        }

        await EventSeatModel.deleteMany({ eventId: event._id });
        await EventSeatModel.insertMany(docs);

        event.seatsGenerated = true;
        event.minPrice = computeMinPrice(ticketTypes);
        await event.save();

        return res.status(200).json({ success: true, data: { count: docs.length }, message: "Event seats generated" });
    } catch (error) {
        next(error);
    }
};

const publishEvent = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id }));
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const ticketTypes = await EventTicketTypeModel.countDocuments({ eventId: event._id });
        if (!ticketTypes) {
            return res.status(400).json({ success: false, message: "Add at least one ticket type before publishing" });
        }

        const venue = await VenueModel.findById(event.venueId);
        if (venue?.layoutType === "seated" && !event.seatsGenerated) {
            return res.status(400).json({ success: false, message: "Generate event seats before publishing" });
        }

        event.status = "published";
        event.publishedAt = new Date();
        await event.save();
        return res.status(200).json({ success: true, data: { event }, message: "Event published" });
    } catch (error) {
        next(error);
    }
};

const listMyEvents = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = ownerFilter(req);
        if (req.query.status) query.status = req.query.status;
        if (req.query.search) query.title = { $regex: String(req.query.search), $options: "i" };

        const [events, total] = await Promise.all([
            EventModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("venueId", "name city"),
            EventModel.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: { events, page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

const getMyEvent = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id })).populate("venueId", "name city layoutType");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        const [ticketTypes, revenueAgg, seatCounts] = await Promise.all([
            EventTicketTypeModel.find({ eventId: event._id }),
            BookingModel.aggregate([
                { $match: { eventId: event._id, status: "confirmed" } },
                { $group: { _id: null, revenue: { $sum: "$totalAmount" }, tickets: { $sum: "$quantity" }, count: { $sum: 1 } } },
            ]),
            EventSeatModel.aggregate([
                { $match: { eventId: event._id } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
        ]);

        const stats = {
            revenue: revenueAgg[0]?.revenue || 0,
            ticketsSold: revenueAgg[0]?.tickets || 0,
            bookings: revenueAgg[0]?.count || 0,
        };
        const seatMap = seatCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
        const seatSummary = {
            total: Object.values(seatMap).reduce((a, b) => a + b, 0),
            booked: seatMap.booked || 0,
            locked: seatMap.locked || 0,
            available: seatMap.available || 0,
        };

        return res.status(200).json({ success: true, data: { event, ticketTypes, stats, seatSummary } });
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id })).select("_id status");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        const booked = await EventSeatModel.countDocuments({ eventId: event._id, status: "booked" });
        if (booked > 0) {
            return res.status(409).json({ success: false, message: "Cannot delete an event with bookings. Cancel it instead." });
        }
        await Promise.all([
            EventSeatModel.deleteMany({ eventId: event._id }),
            EventTicketTypeModel.deleteMany({ eventId: event._id }),
            EventModel.deleteOne({ _id: event._id }),
        ]);
        return res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
        next(error);
    }
};

// Aggregate revenue + counts across all of the organizer's events (admin: all).
const getOrganizerSummary = async (req, res, next) => {
    try {
        const filter = isAdmin(req) ? {} : { organizerId: req.user._id };
        const events = await EventModel.find(filter).select("_id status");
        const ids = events.map((e) => e._id);

        const revenueAgg = await BookingModel.aggregate([
            { $match: { eventId: { $in: ids }, status: "confirmed" } },
            { $group: { _id: null, revenue: { $sum: "$totalAmount" }, tickets: { $sum: "$quantity" }, count: { $sum: 1 } } },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalEvents: events.length,
                published: events.filter((e) => e.status === "published").length,
                drafts: events.filter((e) => e.status === "draft").length,
                revenue: revenueAgg[0]?.revenue || 0,
                ticketsSold: revenueAgg[0]?.tickets || 0,
                bookings: revenueAgg[0]?.count || 0,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Paginated bookings for one of the organizer's events.
const getEventBookings = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id })).select("_id");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = { eventId: event._id };
        if (req.query.status) query.status = req.query.status;

        const [bookings, total] = await Promise.all([
            BookingModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "name email")
                .select("bookingCode status totalAmount quantity type seats items createdAt userId"),
            BookingModel.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: { bookings, page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

// Organizer seat map (any status) showing which seats are booked/locked/available.
const getManageSeatMap = async (req, res, next) => {
    try {
        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id })).select("_id seatsGenerated");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        if (!event.seatsGenerated) {
            return res.status(200).json({ success: true, data: { seatsGenerated: false, sections: [] } });
        }

        const seats = await EventSeatModel.find({ eventId: event._id })
            .select("section row seatNumber category price status")
            .sort({ section: 1, row: 1, seatNumber: 1 });

        const sectionsMap = new Map();
        for (const s of seats) {
            if (!sectionsMap.has(s.section)) sectionsMap.set(s.section, []);
            sectionsMap.get(s.section).push(s);
        }
        const sections = [...sectionsMap.entries()].map(([name, list]) => ({ name, seats: list }));

        return res.status(200).json({
            success: true,
            data: {
                seatsGenerated: true,
                total: seats.length,
                booked: seats.filter((s) => s.status === "booked").length,
                locked: seats.filter((s) => s.status === "locked").length,
                available: seats.filter((s) => s.status === "available").length,
                sections,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Upload an event banner image; returns the public URL to store on the event.
const uploadBanner = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded (field 'banner')" });
        }
        const temp = uploadHelper.getTempObject(req.file);
        const finalPath = `events/${req.user._id}-${temp.tempName}`;
        const result = await uploadHelper.uploadFile({
            tempPath: temp.tempPath,
            finalPath,
            contentType: req.file.mimetype,
        });
        return res.status(201).json({ success: true, data: { url: result.fileUrl }, message: "Banner uploaded" });
    } catch (error) {
        next(error);
    }
};

// Organizer/admin ticket check-in: validate a ticket code for an event.
const checkInTicket = async (req, res, next) => {
    try {
        const { ticketCode } = req.body || {};
        if (!ticketCode || !String(ticketCode).trim()) {
            return res.status(400).json({ success: false, message: "ticketCode is required" });
        }

        const event = await EventModel.findOne(ownerFilter(req, { _id: req.params.id })).select("_id title");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const ticket = await TicketModel.findOne({
            ticketCode: String(ticketCode).trim().toUpperCase(),
            eventId: event._id,
        });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found for this event" });
        }
        if (ticket.status === "cancelled") {
            return res.status(409).json({ success: false, message: "This ticket was cancelled" });
        }
        if (ticket.status === "used") {
            return res.status(409).json({
                success: false,
                message: `Already checked in${ticket.checkedInAt ? ` at ${new Date(ticket.checkedInAt).toLocaleString("en-IN")}` : ""}`,
                data: { ticket },
            });
        }

        ticket.status = "used";
        ticket.checkedInAt = new Date();
        await ticket.save();

        return res.status(200).json({ success: true, data: { ticket }, message: "Checked in successfully" });
    } catch (error) {
        next(error);
    }
};

// ─── Public discovery ─────────────────────────────────────────────────────────

const discoverEvents = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 12);
        const skip = (page - 1) * limit;

        const query = { status: "published" };
        if (req.query.city) query.city = { $regex: `^${String(req.query.city)}$`, $options: "i" };
        if (req.query.category) query.category = String(req.query.category);
        if (req.query.search) query.title = { $regex: String(req.query.search), $options: "i" };

        // Date range (defaults to upcoming).
        const dateFilter = {};
        if (req.query.dateFrom) dateFilter.$gte = new Date(req.query.dateFrom);
        if (req.query.dateTo) dateFilter.$lte = new Date(req.query.dateTo);
        query.startAt = Object.keys(dateFilter).length ? dateFilter : { $gte: new Date() };

        // Price range against denormalized minPrice.
        if (req.query.minPrice || req.query.maxPrice) {
            query.minPrice = {};
            if (req.query.minPrice) query.minPrice.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.minPrice.$lte = Number(req.query.maxPrice);
        }

        const sortMap = {
            soonest: { startAt: 1 },
            latest: { startAt: -1 },
            "price-low": { minPrice: 1 },
            "price-high": { minPrice: -1 },
            newest: { createdAt: -1 },
        };
        const sort = sortMap[req.query.sort] || sortMap.soonest;

        const [events, total] = await Promise.all([
            EventModel.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("venueId", "name city")
                .select("title bannerUrl category city startAt minPrice venueId"),
            EventModel.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: { events, page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

const getPublicEvent = async (req, res, next) => {
    try {
        const event = await EventModel.findOne({ _id: req.params.id, status: "published" })
            .populate("venueId", "name city address layoutType")
            .populate("organizerId", "name");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        const ticketTypes = await EventTicketTypeModel.find({ eventId: event._id });
        return res.status(200).json({ success: true, data: { event, ticketTypes } });
    } catch (error) {
        next(error);
    }
};

// Seat map for a published event: available counts + seat list grouped by section.
const getEventSeatMap = async (req, res, next) => {
    try {
        const event = await EventModel.findOne({ _id: req.params.id, status: "published" }).select("_id seatsGenerated");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        if (!event.seatsGenerated) {
            return res.status(200).json({ success: true, data: { seatsGenerated: false, sections: [] } });
        }

        const seats = await EventSeatModel.find({ eventId: event._id })
            .select("section row seatNumber category price status")
            .sort({ section: 1, row: 1, seatNumber: 1 });

        const sectionsMap = new Map();
        for (const s of seats) {
            if (!sectionsMap.has(s.section)) sectionsMap.set(s.section, []);
            sectionsMap.get(s.section).push(s);
        }
        const sections = [...sectionsMap.entries()].map(([name, seatList]) => ({ name, seats: seatList }));
        const availableCount = seats.filter((s) => s.status === "available").length;

        return res.status(200).json({
            success: true,
            data: { seatsGenerated: true, availableCount, totalSeats: seats.length, sections },
        });
    } catch (error) {
        next(error);
    }
};

// Handlers grouped by HTTP method (see shared controller convention).
const eventController = {
    post: {
        createEvent,
        generateEventSeats,
        publishEvent,
        uploadBanner,
        checkInTicket,
    },
    get: {
        discoverEvents,
        listMyEvents,
        getMyEvent,
        getOrganizerSummary,
        getEventBookings,
        getManageSeatMap,
        getPublicEvent,
        getEventSeatMap,
    },
    put: {
        updateEvent,
    },
    delete: {
        deleteEvent,
    },
};

export default eventController;
