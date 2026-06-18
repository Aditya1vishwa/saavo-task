import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import svg from "../../assets/svg";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { bookingsApi } from "../../api";
import { downloadFile } from "../../apiConfig/apiCall";
import { formatDate, formatMoney, statusBadgeClass } from "../../utils/format";
import "../../../styles/events.css";

const BookingDetail = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await bookingsApi.get(id);
        if (res?.success) setBooking(res.data.booking);
        setLoading(false);
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const cancel = async () => {
        if (!window.confirm("Cancel this booking? Your seats will be released.")) return;
        setCancelling(true);
        const res = await bookingsApi.cancel(id);
        setCancelling(false);
        if (res?.success) {
            toast.success("Booking cancelled");
            load();
        } else {
            toast.error(res?.message || "Could not cancel");
        }
    };

    const downloadTicket = async () => {
        const ok = await downloadFile(bookingsApi.ticketPath(id), `ticket-${booking.bookingCode}.pdf`);
        if (!ok) toast.error("Could not download ticket");
    };

    if (loading) return <FullScreenLoader headingText="Loading booking…" />;
    if (!booking) return <div className="ev_empty">Booking not found.</div>;

    return (
        <div className="ev_checkout">
            <div className="ev_checkout__card">
                <div className="ev_booking_detail__head">
                    <div>
                        <h2>{booking.eventId?.title || "Booking"}</h2>
                        <div className="ev_booking_row__meta">{booking.bookingCode}</div>
                    </div>
                    <span className={`pr_badge ${statusBadgeClass(booking.status)}`}>{booking.status}</span>
                </div>

                {booking.eventId?.startAt && (
                    <div className="ev_checkout__row"><span>When</span><span>{formatDate(booking.eventId.startAt)}</span></div>
                )}
                {booking.eventId?.city && (
                    <div className="ev_checkout__row"><span>Where</span><span>{booking.eventId.city}</span></div>
                )}
                {booking.paymentId?.status && (
                    <div className="ev_checkout__row"><span>Payment</span><span>{booking.paymentId.status} ({booking.paymentId.provider})</span></div>
                )}

                <div className="ev_checkout__seats">
                    <div className="ev_checkout__seats_title">{booking.type === "general" ? "Tickets" : "Seats"}</div>
                    <ul>
                        {booking.type === "general"
                            ? (booking.items || []).map((it, i) => (
                                <li key={i}><span>{it.name} <em>× {it.quantity}</em></span><span>{formatMoney(it.price * it.quantity)}</span></li>
                            ))
                            : booking.seats.map((s, i) => (
                                <li key={i}><span>{s.seatNumber} <em>({s.category})</em></span><span>{formatMoney(s.price)}</span></li>
                            ))}
                    </ul>
                </div>

                <div className="ev_checkout__total"><span>Total</span><strong>{formatMoney(booking.totalAmount)}</strong></div>

                <div className="ev_checkout__actions">
                    {booking.status === "pending" && (
                        <Link className="pr_btn_primary pr_full_width" to={`/checkout/${booking._id}`}>Complete payment</Link>
                    )}
                    {booking.status === "confirmed" && (
                        <>
                            <button className="pr_btn_primary pr_full_width" onClick={downloadTicket}>
                                {svg.ticket({ fill: "#fff", width: 18, height: 18 })} Download ticket
                            </button>
                            <button className="pr_btn_secondary pr_full_width" disabled={cancelling} onClick={cancel}>
                                {cancelling ? "Cancelling…" : "Cancel booking"}
                            </button>
                        </>
                    )}
                    <Link className="pr_link_button ev_back_link" to="/user/bookings">{svg.back({ fill: "#004bd6", width: 16, height: 16 })} Back to my bookings</Link>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
