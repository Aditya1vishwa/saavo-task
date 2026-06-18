import { useEffect, useMemo, useState } from "react";
import { apiCall } from "../../apiConfig/apiCall";
import svg from "../../assets/svg";

const Dhasboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInterviews: 0,
        totalInterviewAttempts: 0,
        totalOpenHelpTickets: 0,
        latestUsers: [],
        latestHelpTickets: [],
    });

    const cards = useMemo(
        () => [
            {
                id: "users",
                label: "Total Users",
                value: stats.totalUsers,
                icon: svg.users,
            },
            {
                id: "interviews",
                label: "Total Interviews",
                value: stats.totalInterviews,
                icon: svg.report,
            },
            {
                id: "attempts",
                label: "Interview Sessions",
                value: stats.totalInterviewAttempts,
                icon: svg.dashboard,
            },
            {
                id: "help",
                label: "Open Help Queries",
                value: stats.totalOpenHelpTickets,
                icon: svg.shield,
            },
        ],
        [stats]
    );

    useEffect(() => {
        const loadData = async () => {
            const res = await apiCall({ url: "/admin/dashboard", method: "GET" });
            if (res?.success) {
                setStats(res?.data || {});
            }
        };
        loadData();
    }, []);

    return (
        <div className="pr_dash">
            <div className="pr_dash__header">
                <div>
                    <h1 className="pr_dash__title">Admin Dashboard</h1>
                    <p className="pr_dash__subtitle">Track platform users, interviews, and support activity.</p>
                </div>
            </div>

            <section className="pr_dash__stats">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article className="pr_dash__stat_card" key={card.id}>
                            <div className="pr_dash__stat_top">
                                <span className="pr_dash__stat_icon">
                                    {Icon({ fill: "#2563eb", height: 20, width: 20 })}
                                </span>
                            </div>
                            <div className="pr_dash__stat_label">{card.label}</div>
                            <div className="pr_dash__stat_value">{card.value}</div>
                        </article>
                    );
                })}
            </section>

            <div className="pr_dash__grid">
                <section className="pr_dash__panel">
                    <div className="pr_dash__panel_header">
                        <h2 className="pr_dash__panel_title">Recent Users</h2>
                    </div>
                    <div className="pr_dash__list">
                        {(stats.latestUsers || []).map((item) => (
                            <div className="pr_dash__list_item" key={item._id}>
                                <div className="pr_dash__item_info">
                                    <div className="pr_dash__item_title">{item.name}</div>
                                    <div className="pr_dash__item_meta">{item.email}</div>
                                </div>
                                <div className="pr_dash__chip">{item.status}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="pr_dash__side">
                    <section className="pr_dash__panel pr_dash__panel--compact">
                        <div className="pr_dash__panel_header">
                            <h2 className="pr_dash__panel_title">Recent Help Requests</h2>
                        </div>
                        <div className="pr_dash__activity_list">
                            {(stats.latestHelpTickets || []).map((ticket) => (
                                <div className="pr_dash__activity_item" key={ticket._id}>
                                    <span className="pr_dash__activity_dot is-info" />
                                    <div>
                                        <div className="pr_dash__activity_title">{ticket.subject}</div>
                                        <div className="pr_dash__activity_time">{ticket?.userId?.email || "Unknown user"}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default Dhasboard;
