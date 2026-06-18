import crypto from "crypto";
import EventModel from "../db/mongodb/models/event.model.js";
import EventSeatModel from "../db/mongodb/models/eventSeat.model.js";
import SeatLockModel from "../db/mongodb/models/seatLock.model.js";
import BookingModel from "../db/mongodb/models/booking.model.js";
import PaymentModel from "../db/mongodb/models/payment.model.js";
import notificationHelper from "../helpers/notification.helper.js";
import emailHelper from "../helpers/email.helper.js";

const LOCK_TTL_MS = 5 * 60 * 1000; // 5 minutes

const toPositiveInt = (value, fallback = 10) => {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const genBookingCode = () => `BKG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

// Reclaim seats whose hold expired but whose status wasn't reset (the SeatLock
// doc is TTL-removed by Mongo, but eventSeat.status must be flipped back here).
const reclaimExpiredSeats = async (eventId) => {
    await EventSeatModel.updateMany(
        { eventId, status: "locked", lockExpiresAt: { $lt: new Date() } },
        { $set: { status: "available", lockedBy: null, lockExpiresAt: null, bookingId: null } }
    );
};

// ─── Seat locking ─────────────────────────────────────────────────────────────

const lockSeats = async (req, res, next) => {
    try {
        const { eventId, seatIds } = req.body || {};
        if (!eventId || !Array.isArray(seatIds) || !seatIds.length) {
            return res.status(400).json({ success: false, message: "eventId and seatIds are required" });
        }
        if (seatIds.length > 10) {
            return res.status(400).json({ success: false, message: "You can select at most 10 seats" });
        }

        const event = await EventModel.findOne({ _id: eventId, status: "published" }).select("_id title");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found or not published" });
        }

        await reclaimExpiredSeats(eventId);

        const expiresAt = new Date(Date.now() + LOCK_TTL_MS);

        // Atomically claim only seats that are currently available.
        const claim = await EventSeatModel.updateMany(
            { _id: { $in: seatIds }, eventId, status: "available" },
            { $set: { status: "locked", lockedBy: req.user._id, lockExpiresAt: expiresAt } }
        );

        // If we couldn't claim them all, roll back our partial claim and fail.
        if (claim.modifiedCount !== seatIds.length) {
            await EventSeatModel.updateMany(
                { _id: { $in: seatIds }, eventId, lockedBy: req.user._id, status: "locked", bookingId: null },
                { $set: { status: "available", lockedBy: null, lockExpiresAt: null } }
            );
            return res.status(409).json({ success: false, message: "Some seats are no longer available. Please reselect." });
        }

        const seats = await EventSeatModel.find({ _id: { $in: seatIds } }).select("seatNumber category price");
        const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

        const lock = await SeatLockModel.create({
            eventId,
            userId: req.user._id,
            seatIds,
            status: "active",
            expiresAt,
        });

        return res.status(201).json({
            success: true,
            data: {
                lockId: lock._id,
                expiresAt,
                seats,
                totalAmount,
                currency: "INR",
            },
            message: "Seats locked for 5 minutes",
        });
    } catch (error) {
        next(error);
    }
};

const releaseLock = async (req, res, next) => {
    try {
        const lock = await SeatLockModel.findOne({ _id: req.params.lockId, userId: req.user._id, status: "active" });
        if (!lock) {
            return res.status(404).json({ success: false, message: "Active lock not found" });
        }
        await EventSeatModel.updateMany(
            { _id: { $in: lock.seatIds }, status: "locked", bookingId: null },
            { $set: { status: "available", lockedBy: null, lockExpiresAt: null } }
        );
        lock.status = "released";
        await lock.save();
        return res.status(200).json({ success: true, message: "Lock released" });
    } catch (error) {
        next(error);
    }
};

// ─── Booking creation (from an active lock) ───────────────────────────────────

const createBooking = async (req, res, next) => {
    try {
        const { lockId } = req.body || {};
        if (!lockId) {
            return res.status(400).json({ success: false, message: "lockId is required" });
        }

        const lock = await SeatLockModel.findOne({ _id: lockId, userId: req.user._id, status: "active" });
        if (!lock || lock.expiresAt < new Date()) {
            return res.status(410).json({ success: false, message: "Your seat hold has expired. Please reselect seats." });
        }

        // Seats must still be locked by this user and not already attached to a booking.
        const seats = await EventSeatModel.find({
            _id: { $in: lock.seatIds },
            status: "locked",
            lockedBy: req.user._id,
            bookingId: null,
        }).select("seatNumber category price");

        if (seats.length !== lock.seatIds.length) {
            return res.status(409).json({ success: false, message: "Seat hold is no longer valid. Please reselect." });
        }

        const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

        const booking = await BookingModel.create({
            bookingCode: genBookingCode(),
            userId: req.user._id,
            eventId: lock.eventId,
            seats: seats.map((s) => ({ eventSeatId: s._id, seatNumber: s.seatNumber, category: s.category, price: s.price })),
            quantity: seats.length,
            totalAmount,
            currency: "INR",
            status: "pending",
        });

        // Attach booking to the held seats (still locked until paid).
        await EventSeatModel.updateMany(
            { _id: { $in: lock.seatIds } },
            { $set: { bookingId: booking._id } }
        );

        // Create a demo payment intent for this booking.
        const payment = await PaymentModel.create({
            bookingId: booking._id,
            userId: req.user._id,
            provider: "demo",
            orderId: `DEMO-${booking.bookingCode}`,
            amount: totalAmount,
            currency: "INR",
            status: "created",
        });

        booking.paymentId = payment._id;
        await booking.save();

        return res.status(201).json({
            success: true,
            data: { booking, payment: { _id: payment._id, amount: payment.amount, status: payment.status, provider: payment.provider } },
            message: "Booking created. Complete payment to confirm.",
        });
    } catch (error) {
        next(error);
    }
};

// ─── DEMO payment ─────────────────────────────────────────────────────────────
// Stand-in for a real gateway. Body: { success: true|false }.
// success → confirm booking + book seats; failure → cancel booking + release seats.
const processDemoPayment = async (req, res, next) => {
    try {
        const success = req.body?.success === true || req.body?.success === "true";

        const booking = await BookingModel.findOne({ _id: req.params.id, userId: req.user._id });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        if (booking.status !== "pending") {
            return res.status(409).json({ success: false, message: `Booking is already ${booking.status}` });
        }

        const payment = await PaymentModel.findById(booking.paymentId);
        const seatIds = booking.seats.map((s) => s.eventSeatId);

        if (!success) {
            // Failed/declined demo payment → cancel booking, free the seats.
            if (payment) {
                payment.status = "failed";
                payment.meta = { ...payment.meta, demo: true, outcome: "failed" };
                await payment.save();
            }
            booking.status = "cancelled";
            booking.cancelledAt = new Date();
            await booking.save();
            await EventSeatModel.updateMany(
                { _id: { $in: seatIds } },
                { $set: { status: "available", lockedBy: null, lockExpiresAt: null, bookingId: null } }
            );
            await SeatLockModel.updateOne({ seatIds: { $all: seatIds }, userId: req.user._id, status: "active" }, { $set: { status: "released" } });
            return res.status(200).json({ success: false, data: { booking }, message: "Payment failed. Seats released." });
        }

        // Successful demo payment → confirm booking, book seats.
        if (payment) {
            payment.status = "paid";
            payment.transactionId = `DEMO-TXN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
            payment.meta = { ...payment.meta, demo: true, outcome: "paid" };
            await payment.save();
        }

        booking.status = "confirmed";
        booking.confirmedAt = new Date();
        await booking.save();

        await EventSeatModel.updateMany(
            { _id: { $in: seatIds } },
            { $set: { status: "booked", lockExpiresAt: null } }
        );
        await SeatLockModel.updateOne({ seatIds: { $all: seatIds }, userId: req.user._id, status: "active" }, { $set: { status: "converted" } });

        // Notify (best-effort; never block confirmation on these).
        notificationHelper.createNotification({
            userId: req.user._id,
            title: "Booking confirmed",
            message: `Your booking ${booking.bookingCode} is confirmed.`,
            key: "booking_confirmed",
            data: { bookingId: booking._id, bookingCode: booking.bookingCode },
        }).catch(() => {});

        emailHelper.sendMail({
            to: req.user.email,
            subject: "Your booking is confirmed",
            templateName: "booking-confirmation",
            data: {
                name: req.user.name || "",
                bookingCode: booking.bookingCode,
                seats: booking.seats.map((s) => s.seatNumber).join(", "),
                amount: booking.totalAmount,
            },
        }).catch(() => {});

        return res.status(200).json({ success: true, data: { booking }, message: "Payment successful. Booking confirmed." });
    } catch (error) {
        next(error);
    }
};

// ─── History ──────────────────────────────────────────────────────────────────

const listMyBookings = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = { userId: req.user._id };
        if (req.query.status) query.status = req.query.status;

        const [bookings, total] = await Promise.all([
            BookingModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("eventId", "title startAt city bannerUrl"),
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

const getBooking = async (req, res, next) => {
    try {
        const booking = await BookingModel.findOne({ _id: req.params.id, userId: req.user._id })
            .populate("eventId", "title startAt city bannerUrl venueId")
            .populate("paymentId", "status provider amount");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        return res.status(200).json({ success: true, data: { booking } });
    } catch (error) {
        next(error);
    }
};

const cancelBooking = async (req, res, next) => {
    try {
        const booking = await BookingModel.findOne({ _id: req.params.id, userId: req.user._id });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        if (booking.status !== "confirmed") {
            return res.status(409).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
        }

        booking.status = "cancelled";
        booking.cancelledAt = new Date();
        await booking.save();

        await EventSeatModel.updateMany(
            { _id: { $in: booking.seats.map((s) => s.eventSeatId) } },
            { $set: { status: "available", lockedBy: null, lockExpiresAt: null, bookingId: null } }
        );

        // Mark the demo payment refunded (real refund flow comes later).
        if (booking.paymentId) {
            await PaymentModel.updateOne({ _id: booking.paymentId, status: "paid" }, { $set: { status: "refunded" } });
        }

        notificationHelper.createNotification({
            userId: req.user._id,
            title: "Booking cancelled",
            message: `Your booking ${booking.bookingCode} has been cancelled.`,
            key: "booking_cancelled",
            data: { bookingId: booking._id, bookingCode: booking.bookingCode },
        }).catch(() => {});

        return res.status(200).json({ success: true, data: { booking }, message: "Booking cancelled" });
    } catch (error) {
        next(error);
    }
};

// Handlers grouped by HTTP method (see shared controller convention).
const bookingController = {
    post: {
        lockSeats,
        createBooking,
        processDemoPayment,
        cancelBooking,
    },
    get: {
        listMyBookings,
        getBooking,
    },
    delete: {
        releaseLock,
    },
};

export default bookingController;
