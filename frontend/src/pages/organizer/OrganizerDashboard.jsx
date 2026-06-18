import { useEffect, useState } from "react";
import { Link } from "react-router";
import { eventsApi, venuesApi } from "../../api";
import useUserStore from "../../store/useUserStore";
import { formatDate, formatMoney, statusBadgeClass } from "../../utils/format";
import "../../../styles/events.css";

const OrganizerDashboard = () => {
    const { user } = useUserStore();
    const [events, setEvents] = useState([]);
    const [venueCount, setVenueCount] = useState(0);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [evRes, vRes, sumRes] = await Promise.all([
                eventsApi.listMine({ page: 1, limit: 50 }),
                venuesApi.list({ page: 1, limit: 1 }),
                eventsApi.summary(),
            ]);
            if (evRes?.success) setEvents(evRes.data.events || []);
            if (vRes?.success) setVenueCount(vRes.data.total || 0);
            if (sumRes?.success) setSummary(sumRes.data);
            setLoading(false);
        })();
    }, []);

    const published = events.filter((e) => e.status === "published").length;
    const drafts = events.filter((e) => e.status === "draft").length;

    return (
        <div className="ev_dash">
            <div className="ev_dash__hero">
                <div>
                    <h2>Organizer console{user?.name ? ` · ${user.name.split(" ")[0]}` : ""}</h2>
                    <p>Manage your venues, events and ticketing.</p>
                </div>
                <div className="ev_dash__hero_actions">
                    <Link to="/organizer/events" className="pr_btn_primary">New event</Link>
                    <Link to="/organizer/venues" className="pr_btn_secondary">Manage venues</Link>
                </div>
            </div>

            <div className="ev_stat_grid">
                <div className="ev_stat_card"><span>{formatMoney(summary?.revenue || 0)}</span><label>Revenue received</label></div>
                <div className="ev_stat_card"><span>{summary?.ticketsSold || 0}</span><label>Tickets sold</label></div>
                <div className="ev_stat_card"><span>{summary?.bookings || 0}</span><label>Bookings</label></div>
                <div className="ev_stat_card"><span>{events.length}</span><label>Total events</label></div>
                <div className="ev_stat_card"><span>{published}</span><label>Published</label></div>
                <div className="ev_stat_card"><span>{drafts}</span><label>Drafts</label></div>
                <div className="ev_stat_card"><span>{venueCount}</span><label>Venues</label></div>
            </div>

            <section className="ev_dash__section">
                <div className="ev_dash__section_head">
                    <h3>Recent events</h3>
                    <Link to="/organizer/events" className="pr_link_button">Manage all</Link>
                </div>
                {loading ? (
                    <div className="ev_empty">Loading…</div>
                ) : events.length === 0 ? (
                    <div className="ev_empty">No events yet. <Link to="/organizer/events">Create one</Link></div>
                ) : (
                    <div className="ev_card_list">
                        {events.slice(0, 6).map((ev) => (
                            <Link key={ev._id} to={`/organizer/events/${ev._id}`} className="ev_list_card ev_list_card--link">
                                <div>
                                    <div className="ev_list_card__title">{ev.title}</div>
                                    <div className="ev_list_card__meta">{formatDate(ev.startAt)} · {ev.venueId?.name || ""}</div>
                                </div>
                                <span className={`pr_badge ${statusBadgeClass(ev.status)}`}>{ev.status}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrganizerDashboard;
