import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import SelectInput from "../../components/common/SelectInput";
import { venuesApi } from "../../api";
import "../../../styles/events.css";

const emptyVenue = { name: "", city: "", state: "", address: "", layoutType: "seated", capacity: 0 };

// Build seat docs from a simple grid generator: rows × seatsPerRow, labelled A1..
const generateSeats = ({ section, rows, seatsPerRow, category }) => {
    const seats = [];
    for (let r = 0; r < rows; r++) {
        const rowLabel = String.fromCharCode(65 + (r % 26));
        for (let c = 1; c <= seatsPerRow; c++) {
            seats.push({ section, row: rowLabel, seatNumber: `${section[0] || "S"}-${rowLabel}${c}`, category });
        }
    }
    return seats;
};

const OrganizerVenues = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(null);          // create/edit modal state (null = closed)
    const [layoutFor, setLayoutFor] = useState(null); // venue whose layout we're editing
    const [layoutRows, setLayoutRows] = useState([{ section: "General", rows: 5, seatsPerRow: 10, category: "Regular" }]);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await venuesApi.list({ page: 1, limit: 50 });
        if (res?.success) setVenues(res.data.venues || []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        if (!form.name || !form.city) { toast.error("Name and city are required"); return; }
        setSaving(true);
        const res = form._id ? await venuesApi.update(form._id, form) : await venuesApi.create(form);
        setSaving(false);
        if (res?.success) {
            toast.success(form._id ? "Venue updated" : "Venue created");
            setForm(null);
            load();
        } else toast.error(res?.message || "Could not save venue");
    };

    const remove = async (v) => {
        if (!window.confirm(`Delete venue "${v.name}"?`)) return;
        const res = await venuesApi.remove(v._id);
        if (res?.success) { toast.success("Venue deleted"); load(); }
        else toast.error(res?.message || "Could not delete");
    };

    const saveLayout = async () => {
        const seats = layoutRows.flatMap((block) =>
            generateSeats({
                section: block.section || "General",
                rows: Math.max(1, Number(block.rows) || 1),
                seatsPerRow: Math.max(1, Number(block.seatsPerRow) || 1),
                category: block.category || "Regular",
            })
        );
        // de-dup seatNumbers across blocks
        const seen = new Set();
        const unique = seats.filter((s) => (seen.has(s.seatNumber) ? false : seen.add(s.seatNumber)));
        setSaving(true);
        const res = await venuesApi.setSeatLayout(layoutFor._id, unique);
        setSaving(false);
        if (res?.success) {
            toast.success(`Saved ${res.data.count} seats`);
            setLayoutFor(null);
            load();
        } else toast.error(res?.message || "Could not save layout");
    };

    return (
        <div className="ev_manage">
            <div className="ev_browse__head">
                <div>
                    <h2>Venues</h2>
                    <p>Create venues and define their seat layouts.</p>
                </div>
                <button className="pr_btn_primary" onClick={() => setForm({ ...emptyVenue })}>+ New venue</button>
            </div>

            {loading ? (
                <div className="ev_empty">Loading…</div>
            ) : venues.length === 0 ? (
                <div className="ev_empty">No venues yet. Create your first one.</div>
            ) : (
                <div className="ev_card_list">
                    {venues.map((v) => (
                        <div key={v._id} className="ev_list_card">
                            <div>
                                <div className="ev_list_card__title">{v.name}</div>
                                <div className="ev_list_card__meta">{v.city}{v.state ? `, ${v.state}` : ""} · {v.layoutType} · {v.capacity} seats</div>
                            </div>
                            <div className="ev_list_card__actions">
                                {v.layoutType === "seated" && (
                                    <button className="pr_btn_secondary" onClick={() => { setLayoutFor(v); setLayoutRows([{ section: "General", rows: 5, seatsPerRow: 10, category: "Regular" }]); }}>Seat layout</button>
                                )}
                                <button className="pr_btn_secondary" onClick={() => setForm(v)}>Edit</button>
                                <button className="pr_btn_secondary ev_danger" onClick={() => remove(v)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create / edit venue */}
            <Modal
                isOpen={Boolean(form)}
                onClose={() => setForm(null)}
                title={form?._id ? "Edit venue" : "New venue"}
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setForm(null)}>Cancel</button>
                        <button className="pr_btn_primary" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save"}</button>
                    </div>
                )}
            >
                {form && (
                    <div className="pr_form_stack">
                        <label className="pr_label">Name</label>
                        <input className="pr_input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <label className="pr_label">City</label>
                        <input className="pr_input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        <label className="pr_label">State</label>
                        <input className="pr_input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                        <label className="pr_label">Address</label>
                        <input className="pr_input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                        <label className="pr_label">Layout type</label>
                        <SelectInput
                            options={[{ value: "seated", label: "Seated (assigned seats)" }, { value: "general", label: "General admission" }]}
                            value={form.layoutType}
                            onChange={(v) => setForm({ ...form, layoutType: v })}
                        />
                    </div>
                )}
            </Modal>

            {/* Seat layout generator */}
            <Modal
                isOpen={Boolean(layoutFor)}
                onClose={() => setLayoutFor(null)}
                title={`Seat layout · ${layoutFor?.name || ""}`}
                width={760}
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setLayoutFor(null)}>Cancel</button>
                        <button className="pr_btn_primary" disabled={saving} onClick={saveLayout}>{saving ? "Saving…" : "Save layout"}</button>
                    </div>
                )}
            >
                <p className="ev_hint">Define one or more seating blocks. Each block generates rows × seats with a category used for pricing.</p>
                {layoutRows.map((block, i) => (
                    <div key={i} className="ev_layout_block">
                        <input className="pr_input" placeholder="Section (e.g. VIP)" value={block.section}
                            onChange={(e) => setLayoutRows((rows) => rows.map((b, j) => j === i ? { ...b, section: e.target.value } : b))} />
                        <input className="pr_input" type="number" min="1" placeholder="Rows" value={block.rows}
                            onChange={(e) => setLayoutRows((rows) => rows.map((b, j) => j === i ? { ...b, rows: e.target.value } : b))} />
                        <input className="pr_input" type="number" min="1" placeholder="Seats/row" value={block.seatsPerRow}
                            onChange={(e) => setLayoutRows((rows) => rows.map((b, j) => j === i ? { ...b, seatsPerRow: e.target.value } : b))} />
                        <input className="pr_input" placeholder="Category" value={block.category}
                            onChange={(e) => setLayoutRows((rows) => rows.map((b, j) => j === i ? { ...b, category: e.target.value } : b))} />
                        {layoutRows.length > 1 && (
                            <button className="pr_btn_secondary ev_danger" onClick={() => setLayoutRows((rows) => rows.filter((_, j) => j !== i))}>×</button>
                        )}
                    </div>
                ))}
                <button className="pr_btn_secondary" onClick={() => setLayoutRows((rows) => [...rows, { section: "", rows: 5, seatsPerRow: 10, category: "Regular" }])}>+ Add block</button>
                <div className="ev_hint" style={{ marginTop: 12 }}>
                    Total seats: {layoutRows.reduce((sum, b) => sum + (Number(b.rows) || 0) * (Number(b.seatsPerRow) || 0), 0)}
                </div>
            </Modal>
        </div>
    );
};

export default OrganizerVenues;
