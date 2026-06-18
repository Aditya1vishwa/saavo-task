import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import svg from "../../assets/svg";
import { ticketsApi } from "../../api";
import { formatDate, formatMoney } from "../../utils/format";
import "../../../styles/events.css";

// Global organizer ticket scanner. Scans a ticket QR (or accepts a manual code),
// validates it server-side, marks it used (so it can't be re-scanned), and shows
// the ticket details. Works across all of the organizer's events.
const ScanTickets = () => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [manual, setManual] = useState("");
    const [processing, setProcessing] = useState(false);
    const scannerRef = useRef(null);
    const lockRef = useRef(false);

    const validate = async (code) => {
        if (!code) return;
        setProcessing(true);
        const res = await ticketsApi.checkIn(code);
        setProcessing(false);
        setResult({ ok: !!res?.success, message: res?.message, details: res?.data?.details || null });
        if (res?.success) toast.success("Ticket valid — checked in");
        else toast.error(res?.message || "Invalid ticket");
    };

    // Debounce repeated decodes of the same QR (camera fires continuously).
    const onDecode = async (text) => {
        if (lockRef.current) return;
        lockRef.current = true;
        await validate(String(text || "").trim().toUpperCase());
        setTimeout(() => { lockRef.current = false; }, 3000);
    };

    const startScan = async () => {
        setResult(null);
        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            const instance = new Html5Qrcode("qr-reader");
            scannerRef.current = instance;
            await instance.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                onDecode,
                () => {}
            );
            setScanning(true);
        } catch {
            toast.error("Could not start the camera. Check browser permissions (camera needs HTTPS or localhost).");
        }
    };

    const stopScan = async () => {
        try {
            if (scannerRef.current) {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
            }
        } catch { /* ignore */ }
        setScanning(false);
    };

    useEffect(() => () => {
        if (scannerRef.current) {
            scannerRef.current.stop().catch(() => {});
            scannerRef.current = null;
        }
    }, []);

    const submitManual = async (e) => {
        e.preventDefault();
        if (!manual.trim()) return;
        await validate(manual.trim().toUpperCase());
        setManual("");
    };

    const d = result?.details;

    return (
        <div className="ev_manage">
            <Link to="/organizer/dashboard" className="pr_link_button ev_back_link">{svg.back({ fill: "#004bd6", width: 16, height: 16 })} Dashboard</Link>

            <div className="ev_manage__head">
                <div>
                    <h2>Ticket scanner</h2>
                    <div className="ev_list_card__meta">Scan an attendee's ticket QR to validate entry. Each ticket can only be checked in once.</div>
                </div>
            </div>

            <div className="ev_scan">
                <div className="ev_scan__cam">
                    <div id="qr-reader" className="ev_scan__reader" />
                    {!scanning ? (
                        <button className="pr_btn_primary" onClick={startScan}>
                            {svg.ticket({ fill: "#fff", width: 18, height: 18 })} Start camera
                        </button>
                    ) : (
                        <button className="pr_btn_secondary" onClick={stopScan}>Stop camera</button>
                    )}

                    <form className="ev_scan__manual" onSubmit={submitManual}>
                        <input
                            className="pr_input"
                            placeholder="Or enter ticket code (e.g. TKT-A1B2C3D4E5)"
                            value={manual}
                            onChange={(e) => setManual(e.target.value)}
                        />
                        <button type="submit" className="pr_btn_primary" disabled={processing}>
                            {processing ? "Checking…" : "Validate"}
                        </button>
                    </form>
                </div>

                {result && (
                    <div className={`ev_scan__result ${result.ok ? "is-ok" : "is-err"}`}>
                        <div className="ev_scan__result_head">
                            <span className="ev_scan__result_icon">{result.ok ? "✓" : "✕"}</span>
                            <div>
                                <strong>{result.ok ? "Valid — checked in" : "Not valid"}</strong>
                                <div className="ev_scan__result_msg">{result.message}</div>
                            </div>
                        </div>
                        {d && (
                            <div className="ev_scan__details">
                                {d.event?.title && <div className="ev_checkout__row"><span>Event</span><strong>{d.event.title}</strong></div>}
                                {d.event?.startAt && <div className="ev_checkout__row"><span>When</span><span>{formatDate(d.event.startAt)}</span></div>}
                                {d.attendee?.name && <div className="ev_checkout__row"><span>Attendee</span><span>{d.attendee.name}</span></div>}
                                {d.bookingCode && <div className="ev_checkout__row"><span>Booking</span><span>{d.bookingCode}</span></div>}
                                {Array.isArray(d.seats) && d.seats.length > 0 && <div className="ev_checkout__row"><span>Seats</span><strong>{d.seats.join(", ")}</strong></div>}
                                {d.amount != null && <div className="ev_checkout__row"><span>Amount</span><span>{formatMoney(d.amount)}</span></div>}
                                <div className="ev_checkout__row"><span>Ticket</span><span>{d.ticketCode}</span></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanTickets;
