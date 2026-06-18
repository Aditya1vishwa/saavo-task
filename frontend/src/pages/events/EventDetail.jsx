import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import svg from "../../assets/svg";
import PublicTopbar from "../../components/wrapper/PublicTopbar";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { eventsApi, bookingsApi } from "../../api";
import useUserStore from "../../store/useUserStore";
import { formatDate, formatMoney, bannerSrc } from "../../utils/format";
import "../../../styles/events.css";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useUserStore();

    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [seatMap, setSeatMap] = useState(null);
    const [selected, setSelected] = useState({}); // seated: seatId -> seat
    const [qty, setQty] = useState({});            // general: ticketTypeId -> count
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    const isGA = event?.venueId?.layoutType === "general";

    const load = useCallback(async () => {
        setLoading(true);
        const [detailRes, seatRes] = await Promise.all([
            eventsApi.getPublic(id),
            eventsApi.getSeatMap(id),
        ]);
        if (detailRes?.success) {
            setEvent(detailRes.data.event);
            setTicketTypes(detailRes.data.ticketTypes || []);
        }
        if (seatRes?.success) setSeatMap(seatRes.data);
        setLoading(false);
    }, [id]);

    useEffect(() => { load(); }, [load]);

    // ── Seated selection ──
    const toggleSeat = (seat) => {
        if (seat.status !== "available") return;
        setSelected((prev) => {
            const next = { ...prev };
            if (next[seat._id]) delete next[seat._id];
            else {
                if (Object.keys(next).length >= 10) {
                    toast.error("You can select up to 10 seats");
                    return prev;
                }
                next[seat._id] = seat;
            }
            return next;
        });
    };

    // ── General-admission quantity ──
    const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
    const changeQty = (tt, delta) => {
        setQty((prev) => {
            const current = prev[tt._id] || 0;
            const nextVal = current + delta;
            if (nextVal < 0) return prev;
            if (delta > 0 && totalQty >= 10) {
                toast.error("You can book up to 10 tickets");
                return prev;
            }
            const next = { ...prev };
            if (nextVal === 0) delete next[tt._id];
            else next[tt._id] = nextVal;
            return next;
        });
    };

    const selectedSeats = Object.values(selected);
    const total = isGA
        ? ticketTypes.reduce((sum, t) => sum + (qty[t._id] || 0) * t.price, 0)
        : selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
    const hasSelection = isGA ? totalQty > 0 : selectedSeats.length > 0;

    const requireLogin = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to book");
            navigate("/login");
            return false;
        }
        return true;
    };

    const proceedSeated = async () => {
        const lockRes = await bookingsApi.lock(id, selectedSeats.map((s) => s._id));
        if (!lockRes?.success) {
            toast.error(lockRes?.message || "Could not hold seats");
            await load();
            return null;
        }
        return bookingsApi.create(lockRes.data.lockId);
    };

    const proceedGeneral = async () => {
        const items = ticketTypes
            .filter((t) => qty[t._id])
            .map((t) => ({ ticketTypeId: t._id, quantity: qty[t._id] }));
        return bookingsApi.createGeneral(id, items);
    };

    const proceed = async () => {
        if (!requireLogin()) return;
        if (!hasSelection) {
            toast.error(isGA ? "Select at least one ticket" : "Select at least one seat");
            return;
        }
        setBooking(true);
        const bookingRes = isGA ? await proceedGeneral() : await proceedSeated();
        setBooking(false);
        if (!bookingRes) return;
        if (!bookingRes.success) {
            toast.error(bookingRes.message || "Could not create booking");
            await load();
            return;
        }
        navigate(`/checkout/${bookingRes.data.booking._id}`);
    };

    if (loading) return <div className="ev_public"><PublicTopbar /><FullScreenLoader headingText="Loading event…" /></div>;
    if (!event) return <div className="ev_public"><PublicTopbar /><div className="ev_empty">Event not found.</div></div>;

    return (
        <div className="ev_public">
            <PublicTopbar />
            <div className="ev_detail">
                <div className="ev_detail__banner">
                    <img src={bannerSrc(event.bannerUrl)} alt={event.title} />
                </div>

                <div className="ev_detail__grid">
                    <div className="ev_detail__main">
                        <div className="ev_detail__head">
                            {event.category && <span className="ev_card__chip ev_card__chip--static">{event.category}</span>}
                            <h1>{event.title}</h1>
                            <div className="ev_detail__meta">
                                <span>{svg.calendar({ fill: "#475569", width: 16, height: 16 })} {formatDate(event.startAt)}</span>
                                <span>{svg.mapPin({ fill: "#475569", width: 16, height: 16 })} {event.venueId?.name}{event.city ? `, ${event.city}` : ""}</span>
                                {event.organizerId?.name && <span>{svg.user({ fill: "#475569", height: 16, width: 16 })} {event.organizerId.name}</span>}
                            </div>
                        </div>

                        {event.description && (
                            <div className="ev_detail__desc" dangerouslySetInnerHTML={{ __html: event.description }} />
                        )}

                        {/* General admission: ticket types with quantity steppers */}
                        {isGA ? (
                            <div className="ev_detail__tickets">
                                <h3>Select tickets</h3>
                                {ticketTypes.length === 0 ? (
                                    <div className="ev_detail__notice">Tickets aren't available for this event yet.</div>
                                ) : (
                                    <div className="ev_ga_list">
                                        {ticketTypes.map((t) => {
                                            const soldOut = t.availableQuantity <= 0;
                                            return (
                                                <div key={t._id} className="ev_ga_row">
                                                    <div>
                                                        <div className="ev_ga_row__name">{t.name}</div>
                                                        <div className="ev_ga_row__meta">
                                                            {formatMoney(t.price)} · {soldOut ? "Sold out" : `${t.availableQuantity} left`}
                                                        </div>
                                                    </div>
                                                    <div className="ev_stepper">
                                                        <button type="button" onClick={() => changeQty(t, -1)} disabled={!qty[t._id]}>−</button>
                                                        <span>{qty[t._id] || 0}</span>
                                                        <button type="button" onClick={() => changeQty(t, 1)} disabled={soldOut || (qty[t._id] || 0) >= t.availableQuantity}>+</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {ticketTypes.length > 0 && (
                                    <div className="ev_detail__tickets">
                                        <h3>Ticket categories</h3>
                                        <div className="ev_ticket_list">
                                            {ticketTypes.map((t) => (
                                                <div key={t._id} className="ev_ticket_pill" style={{ borderColor: t.color }}>
                                                    <span className="ev_ticket_pill__dot" style={{ background: t.color }} />
                                                    <span>{t.name}</span>
                                                    <strong>{formatMoney(t.price)}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {seatMap?.seatsGenerated ? (
                                    <div className="ev_seatmap">
                                        <div className="ev_seatmap__head">
                                            <h3>Select your seats</h3>
                                            <div className="ev_seatmap__legend">
                                                <span><i className="seat seat--available" /> Available</span>
                                                <span><i className="seat seat--selected" /> Selected</span>
                                                <span><i className="seat seat--taken" /> Taken</span>
                                            </div>
                                        </div>
                                        {seatMap.sections.map((section) => (
                                            <div key={section.name} className="ev_seatmap__section">
                                                <div className="ev_seatmap__section_title">{section.name}</div>
                                                <div className="ev_seatmap__seats">
                                                    {section.seats.map((seat) => {
                                                        const isSel = Boolean(selected[seat._id]);
                                                        const cls = isSel
                                                            ? "seat seat--selected"
                                                            : seat.status === "available"
                                                                ? "seat seat--available"
                                                                : "seat seat--taken";
                                                        return (
                                                            <button
                                                                key={seat._id}
                                                                type="button"
                                                                className={cls}
                                                                title={`${seat.seatNumber} · ${formatMoney(seat.price)}`}
                                                                onClick={() => toggleSeat(seat)}
                                                                disabled={seat.status !== "available" && !isSel}
                                                            >
                                                                {seat.seatNumber}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="ev_detail__notice">Seat selection for this event isn't available yet.</div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Summary rail */}
                    <aside className="ev_detail__summary">
                        <div className="ev_summary_card">
                            <h3>Your selection</h3>
                            {!hasSelection ? (
                                <p className="ev_summary_card__empty">{isGA ? "No tickets selected yet." : "No seats selected yet."}</p>
                            ) : isGA ? (
                                <ul className="ev_summary_list">
                                    {ticketTypes.filter((t) => qty[t._id]).map((t) => (
                                        <li key={t._id}>
                                            <span>{t.name} <em>× {qty[t._id]}</em></span>
                                            <span>{formatMoney(t.price * qty[t._id])}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="ev_summary_list">
                                    {selectedSeats.map((s) => (
                                        <li key={s._id}>
                                            <span>{s.seatNumber} <em>({s.category})</em></span>
                                            <span>{formatMoney(s.price)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="ev_summary_total">
                                <span>Total</span>
                                <strong>{formatMoney(total)}</strong>
                            </div>
                            <button className="pr_btn_primary pr_full_width" disabled={booking || !hasSelection} onClick={proceed}>
                                {booking ? "Processing…" : "Proceed to checkout"}
                            </button>
                            {!isGA && <p className="ev_summary_note">Seats are held for 5 minutes during checkout.</p>}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
