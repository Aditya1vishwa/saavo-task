import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import svg from "../../assets/svg";
import { eventsApi } from "../../api";
import { formatDate, formatMoney, statusBadgeClass } from "../../utils/format";
import "../../../styles/events.css";

const EventManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        const res = await eventsApi.getMine(id);
        if (res?.success) {
            setEvent(res.data.event);
            setTicketTypes(res.data.ticketTypes || []);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => { load(); }, [load]);

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

    if (loading) return <div className="ev_empty">Loading…</div>;
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

            <div className="ev_manage__danger">
                <button className="pr_btn_secondary ev_danger" onClick={remove}>Delete event</button>
            </div>
        </div>
    );
};

export default EventManage;
