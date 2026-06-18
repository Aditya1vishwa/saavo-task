import { NavLink } from "react-router";
import { useMemo, useState } from "react";
import svg from "../../assets/svg";
import useUserStore from "../../store/useUserStore";

const adminMenu = [
    { id: "dashboard", title: "Dashboard", icon: svg.dashboard, href: "/admin/dashboard" },
    { id: "users", title: "Users", icon: svg.users, href: "/admin/users" },
    { id: "key-values", title: "Key Values", icon: svg.settings, href: "/admin/key-values" },
    { id: "helpdesk", title: "Help Desk", icon: svg.shield, href: "/admin/helpdesk" },
];

const organizerMenu = [
    { id: "dashboard", title: "Dashboard", icon: svg.dashboard, href: "/organizer/dashboard" },
    { id: "events", title: "My Events", icon: svg.report, href: "/organizer/events" },
    { id: "venues", title: "Venues", icon: svg.report, href: "/organizer/venues" },
    { id: "settings", title: "Settings", icon: svg.settings, href: "/user/settings" },
    { id: "help", title: "Need Help", icon: svg.shield, href: "/user/help" },
];

const attendeeMenu = [
    { id: "browse", title: "Browse Events", icon: svg.dashboard, href: "/events" },
    { id: "dashboard", title: "Dashboard", icon: svg.report, href: "/user/dashboard" },
    { id: "bookings", title: "My Bookings", icon: svg.report, href: "/user/bookings" },
    { id: "settings", title: "Settings", icon: svg.settings, href: "/user/settings" },
    { id: "help", title: "Need Help", icon: svg.shield, href: "/user/help" },
];

const Sidebar = ({ isOpen, toggle, role = "user" }) => {
    const [openGroups, setOpenGroups] = useState({});
    const { user } = useUserStore();

    const filteredMenu = useMemo(() => {
        if (role === "admin") return adminMenu;
        if (role === "organizer") return organizerMenu;
        return attendeeMenu;
    }, [role]);

    const helpHref = role === "admin" ? "/admin/helpdesk" : "/user/help";

    const toggleGroup = (id) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <aside className={`pr_sidebar ${isOpen ? "is-open" : ""}`}>
            <button className="pr_sidebar_handle" onClick={toggle}>{svg.sidebarHandle({})}</button>
            <div className="pr_sidebar__header">
                <div className="pr_sidebar__brand">
                    <img src="/favicon.png" alt="EventNest Logo" style={{ width: 39, height: 41 }} />
                    <div>
                        <div className="pr_sidebar__title">EventNest</div>
                        <div className="pr_sidebar__subtitle">Book events in seconds</div>
                    </div>
                </div>
            </div>

            <div className="pr_sidebar__section">
                <div className="pr_sidebar__section_title">Menu</div>
                <nav className="pr_sidebar__nav">
                    {filteredMenu.map((item) => {
                        const Icon = item.icon;
                        if (item.children) {
                            const isExpanded = Boolean(openGroups[item.id]);
                            return (
                                <div className="pr_sidebar__group" key={item.id}>
                                    <button
                                        type="button"
                                        className="pr_sidebar__link pr_sidebar__link--group"
                                        onClick={() => toggleGroup(item.id)}
                                    >
                                        <span className="pr_sidebar__link_icon">{Icon({ fill: "#e2e8f0" })}</span>
                                        <span className="pr_sidebar__link_text">{item.title}</span>
                                        <span className={`pr_sidebar__chevron ${isExpanded ? "is-open" : ""}`}>
                                            {svg.chevronDown({ fill: "#e2e8f0" })}
                                        </span>
                                    </button>
                                    <div className={`pr_sidebar__submenu ${isExpanded ? "is-open" : ""}`}>
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.id}
                                                to={child.href}
                                                className={({ isActive }) => `pr_sidebar__sublink ${isActive ? "is-active" : ""}`}
                                            >
                                                <span className="pr_sidebar__dot" />
                                                {child.title}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.id}
                                to={item.href}
                                end={item.href === "/events"}
                                className={({ isActive }) => `pr_sidebar__link ${isActive ? "is-active" : ""}`}
                            >
                                <span className="pr_sidebar__link_icon">{Icon({ fill: "#e2e8f0" })}</span>
                                <span className="pr_sidebar__link_text">{item.title}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="pr_sidebar__footer">
                <div className="pr_sidebar__help">
                    <NavLink className="pr_sidebar__help_btn" to={helpHref}>
                        <span>Need help?</span>
                        <span className="pr_sidebar__help_icon">
                            {svg.chevronRight({ fill: "#0f172a", height: 16, width: 16 })}
                        </span>
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
