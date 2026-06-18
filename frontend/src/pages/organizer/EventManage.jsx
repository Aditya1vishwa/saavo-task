import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import svg from "../../assets/svg";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import CustomTable from "../../components/common/CustomTable";
import { eventsApi } from "../../api";
import { formatDate, formatMoney, statusBadgeClass } from "../../utils/format";
import "../../../styles/events.css";

const EventManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [stats, setStats] = useState(null);
    const [seatSummary, setSeatSummary] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingPage, setBookingPage] = useState(1);
    const [bookingPages, setBookingPages] = useState(1);
    const [seatMap, setSeatMap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState("");
    const [checkCode, setCheckCode] = useState("");
    const [checking, setChecking] = useState(false);
    const [checkResult, setCheckResult] = useState(null);

    const loadBookings = useCallback(async (page = 1) => {
        const res = await eventsApi.bookings(id, { page, limit: 10 });
        if (res?.success) {
            setBookings(res.data.bookings || []);
            setBookingPages(res.data.totalPages || 1);
            setBookingPage(res.data.page || 1);
        }
    }, [id]);

    const loadSeatMap = useCallback(async () => {
        const res = await eventsApi.manageSeatMap(id);
        if (res?.success) setSeatMap(res.data);
    }, [id]);

    const doCheckIn = async (e) => {
        e?.preventDefault();
        if (!checkCode.trim()) return;
        setChecking(true);
        const res = await eventsApi.checkIn(id, checkCode.trim());
        setChecking(false);
        setCheckResult({ ok: !!res?.success, message: res?.message, ticket: res?.data?.ticket });
        if (res?.success) { toast.success("Checked in"); setCheckCode(""); }
        else toast.error(res?.message || "Check-in failed");
    };

    const load = useCallback(async () => {
        setLoading(true);
        const res = await eventsApi.getMine(id);
        if (res?.success) {
            setEvent(res.data.event);
            setTicketTypes(res.data.ticketTypes || []);
            setStats(res.data.stats || null);
            setSeatSummary(res.data.seatSummary || null);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => { loadBookings(1); loadSeatMap(); }, [loadBookings, loadSeatMap]);

    const isSeated = event?.venueId?.layoutType === "seated";

    const run = async (label, fn, successMsg) => {
        setBusy(label);
        const res = await fn();
        setBusy("");
        if (res?.success) { toast.success(successMsg); load(); }
        else toast.error(res?.message || "Action failed");
        return res;
    };

    const remove = async () => {
        if (!window.confirm("Delete this event?")) return;
        const res = await eventsApi.remove(id);
        if (res?.success) { toast.success("Event deleted"); navigate("/organizer/events"); }
        else toast.error(res?.message || "Could not delete");
    };

    const bookingColumns = [
        { label: "Booking", key: "bookingCode" },
        { label: "Attendee", key: "attendee", render: (r) => r.userId?.name || r.userId?.email || "—" },
        {
            label: "Seats / Tickets",
            key: "seats",
            render: (r) => r.type === "general"
                ? (r.items || []).map((i) => `${i.name} ×${i.quantity}`).join(", ")
                : (r.seats || []).map((s) => s.seatNumber).join(", "),
        },
        { label: "Qty", key: "quantity" },
        { label: "Amount", key: "amount", render: (r) => formatMoney(r.totalAmount) },
        { label: "Status", key: "status", render: (r) => <span className={`pr_badge ${statusBadgeClass(r.status)}`}>{r.status}</span> },
        { label: "Date", key: "date", render: (r) => formatDate(r.createdAt, false) },
    ];

    if (loading) return <FullScreenLoader headingText="Loading event…" />;
    if (!event) return <div className="ev_empty">Event not found.</div>;

    return (
        <div className="ev_manage">
            <Link to="/organizer/events" className="pr_link_button ev_back_link">{svg.back({ fill: "#004bd6", width: 16, height: 16 })} All events</Link>

            <div className="ev_manage__head">
                <div>
                    <h2>{event.title}</h2>
                    <div className="ev_list_card__meta">{formatDate(event.startAt)} · {event.venueId?.name}{event.city ? `, ${event.city}` : ""}</div>
                </div>
                <span className={`pr_badge ${statusBadgeClass(event.status)}`}>{event.status}</span>
            </div>

            {stats && (
                <div className="ev_stat_grid ev_manage__stats">
                    <div className="ev_stat_card"><span>{formatMoney(stats.revenue)}</span><label>Revenue received</label></div>
                    <div className="ev_stat_card"><span>{stats.ticketsSold}</span><label>Tickets sold</label></div>
                    <div className="ev_stat_card"><span>{stats.bookings}</span><label>Confirmed bookings</label></div>
                    {isSeated && seatSummary && (
                        <div className="ev_stat_card"><span>{seatSummary.booked}/{seatSummary.total}</span><label>Seats booked</label></div>
                    )}
                </div>
            )}

            <div className="ev_manage__steps">
                <div className="ev_step">
                    <div className="ev_step__num">1</div>
                    <div className="ev_step__body">
                        <h4>Ticket categories</h4>
                        {ticketTypes.length ? (
                            <div className="ev_ticket_list">
                                {ticketTypes.map((t) => (
                                    <div key={t._id} className="ev_ticket_pill" style={{ borderColor: t.color }}>
                                        <span>{t.name}{t.category ? ` · ${t.category}` : ""}</span>
                                        <strong>{formatMoney(t.price)}</strong>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="ev_hint">No ticket categories defined.</p>}
                    </div>
                </div>

                {isSeated && (
                    <div className="ev_step">
                        <div className={`ev_step__num ${event.seatsGenerated ? "ev_step__num--done" : ""}`}>2</div>
                        <div className="ev_step__body">
                            <h4>Seat inventory</h4>
                            <p className="ev_hint">
                                {event.seatsGenerated
                                    ? "Event seats have been generated from the venue layout."
                                    : "Generate per-event seats from the venue's layout (prices come from matching ticket categories)."}
                            </p>
                            <button
                                className="pr_btn_secondary"
                                disabled={busy === "seats"}
                                onClick={() => run("seats", () => eventsApi.generateSeats(id), "Seats generated")}
                            >
                                {busy === "seats" ? "Generating…" : event.seatsGenerated ? "Regenerate seats" : "Generate seats"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="ev_step">
                    <div className={`ev_step__num ${event.status === "published" ? "ev_step__num--done" : ""}`}>{isSeated ? 3 : 2}</div>
                    <div className="ev_step__body">
                        <h4>Publish</h4>
                        <p className="ev_hint">
                            {event.status === "published"
                                ? "This event is live and bookable."
                                : "Publish to make the event visible and bookable by attendees."}
                        </p>
                        {event.status !== "published" ? (
                            <button
                                className="pr_btn_primary"
                                disabled={busy === "publish"}
                                onClick={() => run("publish", () => eventsApi.publish(id), "Event published")}
                            >
                                {busy === "publish" ? "Publishing…" : "Publish event"}
                            </button>
                        ) : (
                            <Link className="pr_btn_secondary" to={`/events/${id}`}>View public page</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Seat status view (seated events) */}
            {isSeated && seatMap?.seatsGenerated && (
                <section className="ev_seatstatus">
                    <div className="ev_seatmap__head">
                        <h3>Seat status</h3>
                        <div className="ev_seatmap__legend">
                            <span><i className="seat seat--available" /> Available ({seatMap.available})</span>
                            <span><i className="seat seat--booked" /> Booked ({seatMap.booked})</span>
                            <span><i className="seat seat--locked" /> Held ({seatMap.locked})</span>
                        </div>
                    </div>
                    {seatMap.sections.map((sec) => (
                        <div key={sec.name} className="ev_seatmap__section">
                            <div className="ev_seatmap__section_title">{sec.name}</div>
                            <div className="ev_seatmap__seats">
                                {sec.seats.map((s) => (
                                    <span
                                        key={s._id}
                                        className={`seat seat--${s.status === "booked" ? "booked" : s.status === "locked" ? "locked" : "available"} seat--readonly`}
                                        title={`${s.seatNumber} · ${s.status}`}
                                    >
                                        {s.seatNumber}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Bookings */}
            <section className="ev_bookings">
                <h3>Bookings</h3>
                {bookings.length === 0 ? (
                    <p className="ev_hint">No bookings yet.</p>
                ) : (
                    <CustomTable data={bookings} columns={bookingColumns} currentPage={bookingPage} totalPages={bookingPages} onPageChange={loadBookings} />
                )}
            </section>

            {event.status === "published" && (
                <section className="ev_checkin">
                    <h3>{svg.ticket({ fill: "#0f172a", width: 20, height: 20 })} Ticket check-in</h3>
                    <p className="ev_hint">Enter an attendee's ticket code to validate entry.</p>
                    <form className="ev_checkin__form" onSubmit={doCheckIn}>
                        <input
                            className="pr_input"
                            placeholder="e.g. TKT-A1B2C3D4E5"
                            value={checkCode}
                            onChange={(e) => setCheckCode(e.target.value)}
                        />
                        <button type="submit" className="pr_btn_primary" disabled={checking}>
                            {checking ? "Checking…" : "Check in"}
                        </button>
                    </form>
                    {checkResult && (
                        <div className={`ev_checkin__result ${checkResult.ok ? "is-ok" : "is-err"}`}>
                            <strong>{checkResult.ok ? "Valid — checked in" : "Not valid"}</strong>
                            <span>{checkResult.message}</span>
                            {checkResult.ticket?.seats?.length > 0 && (
                                <span>Seats: {checkResult.ticket.seats.join(", ")}</span>
                            )}
                        </div>
                    )}
                </section>
            )}

            <div className="ev_manage__danger">
                <button className="pr_btn_secondary ev_danger" onClick={remove}>Delete event</button>
            </div>
        </div>
    );
};

export default EventManage;
