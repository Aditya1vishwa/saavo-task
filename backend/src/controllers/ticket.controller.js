import TicketModel from "../db/mongodb/models/ticket.model.js";

const isAdmin = (req) => req.user?.role === "admin";

// Build a uniform details payload returned on every scan outcome.
const buildDetails = (ticket) => {
    const ev = ticket.eventId || {};
    const booking = ticket.bookingId || {};
    const seats = booking.type === "general"
        ? (booking.items || []).map((i) => `${i.name} ×${i.quantity}`)
        : (ticket.seats && ticket.seats.length ? ticket.seats : (booking.seats || []).map((s) => s.seatNumber));
    return {
        ticketCode: ticket.ticketCode,
        status: ticket.status,
        checkedInAt: ticket.checkedInAt,
        event: { title: ev.title, startAt: ev.startAt, city: ev.city },
        attendee: ticket.userId ? { name: ticket.userId.name, email: ticket.userId.email } : null,
        bookingCode: booking.bookingCode,
        amount: booking.totalAmount,
        seats,
    };
};

// Global organizer scan: validate a ticket code, prevent reuse, return details.
// Works across all of the organizer's events (admin: any event).
const checkIn = async (req, res, next) => {
    try {
        const { ticketCode } = req.body || {};
        if (!ticketCode || !String(ticketCode).trim()) {
            return res.status(400).json({ success: false, message: "ticketCode is required" });
        }

        const ticket = await TicketModel.findOne({ ticketCode: String(ticketCode).trim().toUpperCase() })
            .populate("eventId", "title organizerId startAt city")
            .populate("userId", "name email")
            .populate("bookingId", "bookingCode type seats items totalAmount quantity");

        if (!ticket || !ticket.eventId) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Only the owning organizer (or an admin) may check this ticket in.
        if (!isAdmin(req) && String(ticket.eventId.organizerId) !== String(req.user._id)) {
            return res.status(403).json({ success: false, message: "This ticket belongs to another organizer's event" });
        }

        const details = buildDetails(ticket);

        if (ticket.status === "cancelled") {
            return res.status(409).json({ success: false, message: "This ticket was cancelled", data: { details } });
        }
        if (ticket.status === "used") {
            return res.status(409).json({
                success: false,
                message: `Already checked in${ticket.checkedInAt ? ` at ${new Date(ticket.checkedInAt).toLocaleString("en-IN")}` : ""}`,
                data: { details },
            });
        }

        ticket.status = "used";
        ticket.checkedInAt = new Date();
        await ticket.save();

        return res.status(200).json({ success: true, message: "Ticket valid — checked in", data: { details: { ...details, status: "used", checkedInAt: ticket.checkedInAt } } });
    } catch (error) {
        next(error);
    }
};

const ticketController = {
    post: {
        checkIn,
    },
};

export default ticketController;
