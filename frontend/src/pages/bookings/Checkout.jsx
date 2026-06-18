import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { bookingsApi } from "../../api";
import { formatMoney, formatDate } from "../../utils/format";
import "../../../styles/events.css";

const CheckoutPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await bookingsApi.get(bookingId);
        if (res?.success) setBooking(res.data.booking);
        setLoading(false);
    }, [bookingId]);

    useEffect(() => { load(); }, [load]);

    const pay = async (success) => {
        setPaying(true);
        const res = await bookingsApi.pay(bookingId, success);
        setPaying(false);
        if (success && res?.success) {
            toast.success("Payment successful! Booking confirmed.");
            navigate(`/user/bookings/${bookingId}`);
        } else if (!success) {
            toast.error("Payment failed (demo). Seats released.");
            navigate("/events");
        } else {
            toast.error(res?.message || "Payment could not be processed");
            load();
        }
    };

    if (loading) return <FullScreenLoader headingText="Loading checkout…" />;
    if (!booking) return <div className="ev_empty">Booking not found.</div>;

    if (booking.status !== "pending") {
        return (
            <div className="ev_checkout">
                <div className="ev_checkout__card">
                    <h2>Booking {booking.status}</h2>
                    <p>This booking is no longer pending payment.</p>
                    <button className="pr_btn_primary" onClick={() => navigate(`/user/bookings/${booking._id}`)}>View booking</button>
                </div>
            </div>
        );
    }

    return (
        <div className="ev_checkout">
            <div className="ev_checkout__card">
                <h2>Checkout</h2>
                <div className="ev_checkout__row"><span>Booking</span><strong>{booking.bookingCode}</strong></div>
                {booking.eventId?.title && (
                    <div className="ev_checkout__row"><span>Event</span><strong>{booking.eventId.title}</strong></div>
                )}
                {booking.eventId?.startAt && (
                    <div className="ev_checkout__row"><span>When</span><span>{formatDate(booking.eventId.startAt)}</span></div>
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

                <div className="ev_checkout__total">
                    <span>Total payable</span>
                    <strong>{formatMoney(booking.totalAmount)}</strong>
                </div>

                <div className="ev_checkout__demo">
                    <div className="ev_checkout__demo_tag">Demo payment gateway</div>
                    <p>This is a simulated gateway. Choose an outcome to test the flow.</p>
                    <div className="ev_checkout__actions">
                        <button className="pr_btn_primary pr_full_width" disabled={paying} onClick={() => pay(true)}>
                            {paying ? "Processing…" : `Pay ${formatMoney(booking.totalAmount)} (Success)`}
                        </button>
                        <button className="pr_btn_secondary pr_full_width" disabled={paying} onClick={() => pay(false)}>
                            Simulate failure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
