import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { bookingsApi } from "../../api";
import { formatDate, formatMoney, statusBadgeClass } from "../../utils/format";
import "../../../styles/events.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const load = useCallback(async (pageArg = 1) => {
        setLoading(true);
        const res = await bookingsApi.list({ page: pageArg, limit: 10 });
        if (res?.success) {
            setBookings(res.data.bookings || []);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.page || 1);
        }
        setLoading(false);
    }, []);

    useEffect(() => { load(1); }, [load]);

    return (
        <div className="ev_browse">
            <div className="ev_browse__head">
                <div>
                    <h2>My bookings</h2>
                    <p>Your tickets and booking history.</p>
                </div>
                <Link to="/events" className="pr_btn_primary">Browse events</Link>
            </div>

            {loading ? (
                <div className="ev_empty">Loading…</div>
            ) : bookings.length === 0 ? (
                <div className="ev_empty">No bookings yet. <Link to="/events">Find an event</Link></div>
            ) : (
                <div className="ev_booking_list">
                    {bookings.map((b) => (
                        <Link key={b._id} to={`/user/bookings/${b._id}`} className="ev_booking_row">
                            <div className="ev_booking_row__main">
                                <div className="ev_booking_row__title">{b.eventId?.title || "Event"}</div>
                                <div className="ev_booking_row__meta">
                                    {b.eventId?.startAt ? formatDate(b.eventId.startAt) : ""} · {b.quantity} seat(s) · {b.bookingCode}
                                </div>
                            </div>
                            <div className="ev_booking_row__right">
                                <span className={`pr_badge ${statusBadgeClass(b.status)}`}>{b.status}</span>
                                <strong>{formatMoney(b.totalAmount)}</strong>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="ev_pagination">
                    <button className="pr_btn_secondary" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button className="pr_btn_secondary" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
