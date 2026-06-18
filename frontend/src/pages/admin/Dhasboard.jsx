import { useEffect, useMemo, useState } from "react";
import { apiCall } from "../../apiConfig/apiCall";
import svg from "../../assets/svg";
import CustomTable from "../../components/common/CustomTable";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { formatMoney, formatDate, statusBadgeClass } from "../../utils/format";

const Dhasboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await apiCall({ url: "/admin/dashboard", method: "GET" });
            if (res?.success) setStats(res.data || {});
            setLoading(false);
        })();
    }, []);

    const cards = useMemo(() => stats ? [
        { id: "revenue", label: "Revenue (confirmed)", value: formatMoney(stats.revenue), icon: svg.dashboard },
        { id: "bookings", label: "Confirmed Bookings", value: stats.confirmedBookings ?? 0, icon: svg.report },
        { id: "events", label: "Events (published)", value: `${stats.publishedEvents ?? 0}/${stats.totalEvents ?? 0}`, icon: svg.report },
        { id: "users", label: "Users", value: stats.totalUsers ?? 0, icon: svg.users },
        { id: "organizers", label: "Organizers", value: stats.totalOrganizers ?? 0, icon: svg.users },
        { id: "help", label: "Open Help Queries", value: stats.totalOpenHelpTickets ?? 0, icon: svg.shield },
    ] : [], [stats]);

    const columns = useMemo(() => [
        { label: "Booking", key: "bookingCode" },
        { label: "Event", key: "event", render: (r) => r.eventId?.title || "—" },
        { label: "User", key: "user", render: (r) => r.userId?.name || r.userId?.email || "—" },
        { label: "Seats", key: "quantity" },
        { label: "Amount", key: "amount", render: (r) => formatMoney(r.totalAmount) },
        { label: "Status", key: "status", render: (r) => <span className={`pr_badge ${statusBadgeClass(r.status)}`}>{r.status}</span> },
        { label: "Date", key: "date", render: (r) => formatDate(r.createdAt, false) },
    ], []);

    if (loading) return <FullScreenLoader headingText="Loading dashboard…" />;

    return (
        <div className="pr_dash">
            <div className="pr_dash__header">
                <div>
                    <h1 className="pr_dash__title">Admin Dashboard</h1>
                    <p className="pr_dash__subtitle">Revenue, events, bookings and platform activity.</p>
                </div>
            </div>

            <section className="pr_dash__stats">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article className="pr_dash__stat_card" key={card.id}>
                            <div className="pr_dash__stat_top">
                                <span className="pr_dash__stat_icon">{Icon({ fill: "#2563eb", height: 20, width: 20 })}</span>
                            </div>
                            <div className="pr_dash__stat_label">{card.label}</div>
                            <div className="pr_dash__stat_value">{card.value}</div>
                        </article>
                    );
                })}
            </section>

            <section className="pr_dash__panel" style={{ marginTop: 20 }}>
                <div className="pr_dash__panel_header">
                    <h2 className="pr_dash__panel_title">Recent bookings</h2>
                </div>
                <CustomTable data={stats?.latestBookings || []} columns={columns} currentPage={1} totalPages={1} onPageChange={() => {}} />
            </section>
        </div>
    );
};

export default Dhasboard;
