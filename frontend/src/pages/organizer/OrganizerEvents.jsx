import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import SelectInput from "../../components/common/SelectInput";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { eventsApi, venuesApi } from "../../api";
import { formatDate, statusBadgeClass, bannerSrc } from "../../utils/format";
import "../../../styles/events.css";

const CATEGORIES = ["Concert", "Theatre", "Sports", "Workshop", "Conference", "Comedy", "Other"];
const emptyTicket = () => ({ name: "", category: "", price: "", totalQuantity: "" });

const OrganizerEvents = () => {
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ title: "", venueId: "", category: "Concert", startAt: "", endAt: "", bannerUrl: "", description: "" });
    const [tickets, setTickets] = useState([emptyTicket()]);
    // { layoutType, categories: [] } for the chosen venue — drives the ticket form.
    const [venueInfo, setVenueInfo] = useState(null);

    const selectVenue = async (venueId) => {
        setForm((f) => ({ ...f, venueId }));
        setVenueInfo(null);
        setTickets([emptyTicket()]);
        if (!venueId) return;
        const res = await venuesApi.get(venueId);
        if (res?.success) {
            const layoutType = res.data.venue?.layoutType || "seated";
            const categories = [...new Set((res.data.seats || []).map((s) => s.category).filter(Boolean))];
            setVenueInfo({ layoutType, categories });
            // Seed one ticket type per seat category so every seat is priced and
            // generate-seats maps cleanly. Organizer only fills in prices.
            if (layoutType === "seated" && categories.length) {
                setTickets(categories.map((c) => ({ name: c, category: c, price: "", totalQuantity: "" })));
            }
        }
    };

    const isSeated = venueInfo?.layoutType === "seated";
    const isGeneral = venueInfo?.layoutType === "general";
    const categoryOptions = (venueInfo?.categories || []).map((c) => ({ value: c, label: c }));

    const handleBanner = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("banner", file);
        setUploading(true);
        const res = await eventsApi.uploadBanner(fd);
        setUploading(false);
        if (res?.success) {
            setForm((f) => ({ ...f, bannerUrl: res.data.url }));
            toast.success("Banner uploaded");
        } else {
            toast.error(res?.message || "Upload failed");
        }
    };

    const load = useCallback(async () => {
        setLoading(true);
        const [evRes, vRes] = await Promise.all([
            eventsApi.listMine({ page: 1, limit: 50 }),
            venuesApi.list({ page: 1, limit: 100 }),
        ]);
        if (evRes?.success) setEvents(evRes.data.events || []);
        if (vRes?.success) setVenues(vRes.data.venues || []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const create = async () => {
        if (!form.title || !form.venueId || !form.startAt) {
            toast.error("Title, venue and start date are required");
            return;
        }
        const ticketTypes = tickets
            .filter((t) => t.name && t.price !== "")
            .map((t) => isGeneral
                ? { name: t.name, price: Number(t.price), totalQuantity: Number(t.totalQuantity) || 0 }
                : { name: t.name, category: t.category, price: Number(t.price) });

        if (isSeated && ticketTypes.some((t) => !t.category)) {
            toast.error("Pick a seat category for each ticket type");
            return;
        }
        setSaving(true);
        const res = await eventsApi.create({ ...form, ticketTypes });
        setSaving(false);
        if (res?.success) {
            toast.success("Event created as draft");
            setOpen(false);
            setForm({ title: "", venueId: "", category: "Concert", startAt: "", endAt: "", bannerUrl: "", description: "" });
            setTickets([emptyTicket()]);
            setVenueInfo(null);
            load();
        } else toast.error(res?.message || "Could not create event");
    };

    return (
        <div className="ev_manage">
            <div className="ev_browse__head">
                <div>
                    <h2>My events</h2>
                    <p>Create, configure and publish your events.</p>
                </div>
                <button className="pr_btn_primary" onClick={() => setOpen(true)}>+ New event</button>
            </div>

            {loading ? (
                <FullScreenLoader headingText="Loading events…" />
            ) : events.length === 0 ? (
                <div className="ev_empty">No events yet. Create your first event.</div>
            ) : (
                <div className="ev_card_list">
                    {events.map((ev) => (
                        <Link key={ev._id} to={`/organizer/events/${ev._id}`} className="ev_list_card ev_list_card--link">
                            <div>
                                <div className="ev_list_card__title">{ev.title}</div>
                                <div className="ev_list_card__meta">{formatDate(ev.startAt)} · {ev.venueId?.name || ""}{ev.city ? `, ${ev.city}` : ""}</div>
                            </div>
                            <span className={`pr_badge ${statusBadgeClass(ev.status)}`}>{ev.status}</span>
                        </Link>
                    ))}
                </div>
            )}

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="New event"
                width={760}
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setOpen(false)}>Cancel</button>
                        <button className="pr_btn_primary" disabled={saving} onClick={create}>{saving ? "Creating…" : "Create draft"}</button>
                    </div>
                )}
            >
                {venues.length === 0 ? (
                    <div className="ev_empty">You need a venue first. <Link to="/organizer/venues">Create a venue</Link></div>
                ) : (
                    <div className="pr_form_stack">
                        <label className="pr_label">Title</label>
                        <input className="pr_input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

                        <label className="pr_label">Venue</label>
                        <SelectInput
                            options={venues.map((v) => ({ value: v._id, label: `${v.name} (${v.city}) · ${v.layoutType}` }))}
                            value={form.venueId}
                            onChange={selectVenue}
                            placeholder="Select a venue…"
                        />

                        <div className="ev_form_row">
                            <div>
                                <label className="pr_label">Category</label>
                                <SelectInput
                                    options={CATEGORIES}
                                    value={form.category}
                                    onChange={(v) => setForm({ ...form, category: v })}
                                    placeholder="Category"
                                />
                            </div>
                            <div>
                                <label className="pr_label">Starts at</label>
                                <input className="pr_input" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
                            </div>
                            <div>
                                <label className="pr_label">Ends at</label>
                                <input className="pr_input" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
                            </div>
                        </div>

                        <label className="pr_label">Banner image</label>
                        <div className="ev_banner_upload">
                            {form.bannerUrl && <img className="ev_banner_preview" src={bannerSrc(form.bannerUrl)} alt="Banner preview" />}
                            <label className="pr_btn_secondary ev_upload_btn">
                                {uploading ? "Uploading…" : form.bannerUrl ? "Change image" : "Upload image"}
                                <input type="file" accept="image/*" hidden onChange={handleBanner} disabled={uploading} />
                            </label>
                        </div>

                        <label className="pr_label">Description</label>
                        <textarea className="pr_input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                        <label className="pr_label">Ticket categories</label>
                        {!form.venueId ? (
                            <p className="ev_hint">Select a venue first to configure ticket types.</p>
                        ) : isSeated && categoryOptions.length === 0 ? (
                            <div className="ev_detail__notice">
                                This venue has no seat layout yet. <Link to="/organizer/venues">Add a seat layout</Link> before creating ticket types.
                            </div>
                        ) : (
                            <>
                                <p className="ev_hint">
                                    {isGeneral
                                        ? "General admission — set a price and how many tickets are available per type."
                                        : "Each ticket type maps to a seat category from this venue's layout (price applies to those seats)."}
                                </p>
                                {tickets.map((t, i) => (
                                    <div key={i} className="ev_ticket_row">
                                        <input className="pr_input" placeholder="Name (e.g. VIP)" value={t.name}
                                            onChange={(e) => setTickets((ts) => ts.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                                        {isSeated ? (
                                            <SelectInput
                                                options={categoryOptions}
                                                value={t.category}
                                                onChange={(v) => setTickets((ts) => ts.map((x, j) => j === i ? { ...x, category: v } : x))}
                                                placeholder="Seat category"
                                            />
                                        ) : (
                                            <input className="pr_input" type="number" min="0" placeholder="Quantity" value={t.totalQuantity}
                                                onChange={(e) => setTickets((ts) => ts.map((x, j) => j === i ? { ...x, totalQuantity: e.target.value } : x))} />
                                        )}
                                        <input className="pr_input" type="number" min="0" placeholder="Price" value={t.price}
                                            onChange={(e) => setTickets((ts) => ts.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} />
                                        {tickets.length > 1 && (
                                            <button className="pr_btn_secondary ev_danger" onClick={() => setTickets((ts) => ts.filter((_, j) => j !== i))}>×</button>
                                        )}
                                    </div>
                                ))}
                                <button className="pr_btn_secondary" onClick={() => setTickets((ts) => [...ts, emptyTicket()])}>+ Add ticket type</button>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrganizerEvents;
