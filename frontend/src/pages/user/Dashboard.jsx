import { useEffect, useState } from "react";
import { Link } from "react-router";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { eventsApi, bookingsApi } from "../../api";
import useUserStore from "../../store/useUserStore";
import { formatDate, formatMoney, bannerSrc, statusBadgeClass } from "../../utils/format";
import "../../../styles/events.css";

const MiniEventCard = ({ ev }) => (
    <Link to={`/events/${ev._id}`} className="ev_mini_card">
        <img src={bannerSrc(ev.bannerUrl)} alt={ev.title} loading="lazy" />
        <div className="ev_mini_card__body">
            <div className="ev_mini_card__title">{ev.title}</div>
            <div className="ev_mini_card__meta">{formatDate(ev.startAt, false)} · {ev.city}</div>
            <div className="ev_mini_card__price">From {formatMoney(ev.minPrice)}</div>
        </div>
    </Link>
);

const Dashboard = () => {
    const { user } = useUserStore();
    const [upcoming, setUpcoming] = useState([]);
    const [popular, setPopular] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [soonRes, popRes, bookRes] = await Promise.all([
                eventsApi.discover({ page: 1, limit: 4, sort: "soonest" }),
                eventsApi.discover({ page: 1, limit: 4, sort: "newest" }),
                bookingsApi.list({ page: 1, limit: 5 }),
            ]);
            if (soonRes?.success) setUpcoming(soonRes.data.events || []);
            if (popRes?.success) setPopular(popRes.data.events || []);
            if (bookRes?.success) setBookings(bookRes.data.bookings || []);
            setLoading(false);
        })();
    }, []);

    return (
        <div className="ev_dash">
            <div className="ev_dash__hero">
                <div>
                    <h2>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h2>
                    <p>Find your next experience and manage your bookings.</p>
                </div>
                <Link to="/events" className="pr_btn_primary">Browse all events</Link>
            </div>

            {loading ? (
                <FullScreenLoader headingText="Loading…" />
            ) : (
                <>
                    <section className="ev_dash__section">
                        <div className="ev_dash__section_head">
                            <h3>Upcoming events</h3>
                            <Link to="/events" className="pr_link_button">See all</Link>
                        </div>
                        {upcoming.length ? (
                            <div className="ev_mini_grid">{upcoming.map((e) => <MiniEventCard key={e._id} ev={e} />)}</div>
                        ) : <div className="ev_empty">No upcoming events yet.</div>}
                    </section>

                    <section className="ev_dash__section">
                        <div className="ev_dash__section_head">
                            <h3>Newly added</h3>
                        </div>
                        {popular.length ? (
                            <div className="ev_mini_grid">{popular.map((e) => <MiniEventCard key={e._id} ev={e} />)}</div>
                        ) : <div className="ev_empty">Nothing new right now.</div>}
                    </section>

                    <section className="ev_dash__section">
                        <div className="ev_dash__section_head">
                            <h3>Your recent bookings</h3>
                            <Link to="/user/bookings" className="pr_link_button">View all</Link>
                        </div>
                        {bookings.length ? (
                            <div className="ev_booking_list">
                                {bookings.map((b) => (
                                    <Link key={b._id} to={`/user/bookings/${b._id}`} className="ev_booking_row">
                                        <div className="ev_booking_row__main">
                                            <div className="ev_booking_row__title">{b.eventId?.title || "Event"}</div>
                                            <div className="ev_booking_row__meta">{b.bookingCode} · {b.quantity} seat(s)</div>
                                        </div>
                                        <div className="ev_booking_row__right">
                                            <span className={`pr_badge ${statusBadgeClass(b.status)}`}>{b.status}</span>
                                            <strong>{formatMoney(b.totalAmount)}</strong>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : <div className="ev_empty">No bookings yet. <Link to="/events">Find an event</Link></div>}
                    </section>
                </>
            )}
        </div>
    );
};

export default Dashboard;
