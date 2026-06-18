import crypto from "crypto";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import TicketModel from "../db/mongodb/models/ticket.model.js";

const genTicketCode = () => `TKT-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

// Idempotently issue a ticket for a confirmed booking.
export const issueTicketForBooking = async (booking) => {
    const existing = await TicketModel.findOne({ bookingId: booking._id });
    if (existing) return existing;

    return TicketModel.create({
        ticketCode: genTicketCode(),
        bookingId: booking._id,
        userId: booking.userId,
        eventId: booking.eventId,
        seats: (booking.seats || []).map((s) => s.seatNumber),
        status: "valid",
        issuedAt: new Date(),
    });
};

const money = (n) => `INR ${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
};

// Stream a printable PDF ticket to an Express response.
export const streamTicketPdf = async (res, { booking, event, ticket }) => {
    const qrDataUrl = await QRCode.toDataURL(ticket.ticketCode, { margin: 1, width: 220 });
    const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="ticket-${booking.bookingCode}.pdf"`);
    doc.pipe(res);

    const PRIMARY = "#004bd6";
    const DARK = "#0f172a";
    const MUTED = "#64748b";

    // Header band
    doc.rect(0, 0, doc.page.width, 90).fill(PRIMARY);
    doc.fillColor("#ffffff").fontSize(24).text("EventNest", 50, 32);
    doc.fontSize(11).fillColor("#dbeafe").text("E-Ticket", 50, 62);

    // Event title
    doc.moveDown(3);
    doc.fillColor(DARK).fontSize(22).text(event?.title || "Event", 50, 120);
    doc.moveDown(0.5);

    const line = (label, value) => {
        doc.fillColor(MUTED).fontSize(10).text(label.toUpperCase(), { continued: false });
        doc.fillColor(DARK).fontSize(13).text(value || "—");
        doc.moveDown(0.4);
    };

    doc.moveDown(0.5);
    line("Date & Time", fmtDate(event?.startAt));
    line("Venue", `${event?.venueId?.name || ""}${event?.city ? `, ${event.city}` : ""}`);
    line("Seats", (booking.seats || []).map((s) => s.seatNumber).join(", ") || "General");
    line("Booking Reference", booking.bookingCode);
    line("Ticket Code", ticket.ticketCode);
    line("Amount Paid", money(booking.totalAmount));

    // QR
    doc.image(qrBuffer, doc.page.width - 200, 130, { width: 150 });
    doc.fillColor(MUTED).fontSize(9).text("Scan at entry", doc.page.width - 200, 285, { width: 150, align: "center" });

    // Footer
    doc.fillColor(MUTED).fontSize(9).text(
        "Please carry a valid photo ID. This ticket admits the seats listed above. One scan per ticket.",
        50, doc.page.height - 90, { width: doc.page.width - 100 }
    );

    doc.end();
};

const ticketHelper = { issueTicketForBooking, streamTicketPdf };
export default ticketHelper;
