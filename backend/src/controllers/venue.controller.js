import VenueModel from "../db/mongodb/models/venue.model.js";
import VenueSeatModel from "../db/mongodb/models/venueSeat.model.js";
import EventModel from "../db/mongodb/models/event.model.js";

const toPositiveInt = (value, fallback = 10) => {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const isAdmin = (req) => req.user?.role === "admin";

// Organizers may only touch their own venues; admins may touch any.
const ownershipFilter = (req, extra = {}) =>
    isAdmin(req) ? { ...extra } : { ...extra, createdBy: req.user._id };

const createVenue = async (req, res, next) => {
    try {
        const { name, city } = req.body || {};
        if (!name || !String(name).trim()) {
            return res.status(400).json({ success: false, message: "Venue name is required" });
        }
        if (!city || !String(city).trim()) {
            return res.status(400).json({ success: false, message: "City is required" });
        }

        const venue = await VenueModel.create({
            name: String(name).trim(),
            description: req.body.description || "",
            address: req.body.address || "",
            city: String(city).trim(),
            state: req.body.state || "",
            country: req.body.country || "India",
            pincode: req.body.pincode || "",
            layoutType: req.body.layoutType === "general" ? "general" : "seated",
            capacity: Number(req.body.capacity) || 0,
            createdBy: req.user._id,
        });

        return res.status(201).json({ success: true, data: { venue }, message: "Venue created" });
    } catch (error) {
        next(error);
    }
};

const listVenues = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = ownershipFilter(req);
        if (req.query.search) {
            const search = String(req.query.search);
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
            ];
        }

        const [venues, total] = await Promise.all([
            VenueModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            VenueModel.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: { venues, page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

const getVenue = async (req, res, next) => {
    try {
        const venue = await VenueModel.findOne(ownershipFilter(req, { _id: req.params.id }));
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        const seats = await VenueSeatModel.find({ venueId: venue._id }).sort({ section: 1, row: 1, seatNumber: 1 });
        return res.status(200).json({ success: true, data: { venue, seats } });
    } catch (error) {
        next(error);
    }
};

const updateVenue = async (req, res, next) => {
    try {
        const payload = req.body || {};
        const update = {};
        ["name", "description", "address", "city", "state", "country", "pincode", "layoutType", "capacity", "status"].forEach((field) => {
            if (payload[field] !== undefined) update[field] = payload[field];
        });
        if (update.capacity !== undefined) update.capacity = Number(update.capacity) || 0;

        const venue = await VenueModel.findOneAndUpdate(
            ownershipFilter(req, { _id: req.params.id }),
            { $set: update },
            { new: true }
        );
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        return res.status(200).json({ success: true, data: { venue }, message: "Venue updated" });
    } catch (error) {
        next(error);
    }
};

const deleteVenue = async (req, res, next) => {
    try {
        const venue = await VenueModel.findOne(ownershipFilter(req, { _id: req.params.id })).select("_id");
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        // Block deletion if events already reference this venue.
        const eventCount = await EventModel.countDocuments({ venueId: venue._id });
        if (eventCount > 0) {
            return res.status(409).json({ success: false, message: "Cannot delete a venue that has events. Deactivate it instead." });
        }

        await VenueSeatModel.deleteMany({ venueId: venue._id });
        await VenueModel.deleteOne({ _id: venue._id });
        return res.status(200).json({ success: true, message: "Venue deleted" });
    } catch (error) {
        next(error);
    }
};

// Replace the venue's full seat layout in one call.
// Body: { seats: [{ section, row, seatNumber, category, position }] }
const setSeatLayout = async (req, res, next) => {
    try {
        const venue = await VenueModel.findOne(ownershipFilter(req, { _id: req.params.id }));
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        const seats = Array.isArray(req.body?.seats) ? req.body.seats : [];
        if (!seats.length) {
            return res.status(400).json({ success: false, message: "seats array is required" });
        }

        const seen = new Set();
        const docs = [];
        for (const s of seats) {
            const seatNumber = String(s.seatNumber || "").trim();
            if (!seatNumber) {
                return res.status(400).json({ success: false, message: "Each seat needs a seatNumber" });
            }
            if (seen.has(seatNumber)) {
                return res.status(400).json({ success: false, message: `Duplicate seatNumber: ${seatNumber}` });
            }
            seen.add(seatNumber);
            docs.push({
                venueId: venue._id,
                section: String(s.section || "General").trim(),
                row: String(s.row || "").trim(),
                seatNumber,
                category: String(s.category || "Regular").trim(),
                position: { x: Number(s.position?.x) || 0, y: Number(s.position?.y) || 0 },
            });
        }

        // Replace existing layout atomically-ish (delete then insert).
        await VenueSeatModel.deleteMany({ venueId: venue._id });
        const created = await VenueSeatModel.insertMany(docs);

        venue.capacity = created.length;
        if (venue.layoutType !== "seated") venue.layoutType = "seated";
        await venue.save();

        return res.status(200).json({ success: true, data: { count: created.length }, message: "Seat layout saved" });
    } catch (error) {
        next(error);
    }
};

// Handlers grouped by HTTP method — mirrors the shared controller convention
// (see authController). Routes reference e.g. venueController.post.createVenue.
const venueController = {
    post: {
        createVenue,
    },
    get: {
        listVenues,
        getVenue,
    },
    put: {
        updateVenue,
        setSeatLayout,
    },
    delete: {
        deleteVenue,
    },
};

export default venueController;
