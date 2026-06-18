import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import svg from "../../assets/svg";
import Tooltip from "../Tooltip";
import useUserStore from "../../store/useUserStore";
import { apiCall } from "../../apiConfig/apiCall";

const Header = ({
    onToggleSidebar,
    isSidebarOpen,
    notifications = [],
    onMarkAllRead = async () => { },
    onNotificationClick = async () => { },
}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const profileRef = useRef(null);
    const notifyRef = useRef(null);
    const { user, UStore } = useUserStore();
    const navigate = useNavigate();
    const userType = user?.userType && user.userType.replace("-", " ");
    const userRole = user?.role || "user";
    useEffect(() => {
        const handleClick = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notifyRef.current && !notifyRef.current.contains(event.target)) {
                setIsNotifyOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <header className="pr_header">
            <div className="pr_header__left">
                <div className="pr_header_full">
                    {/* Tagline */}
                </div>
                <button
                    className="pr_icon_button pr_header__menu"
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isSidebarOpen ? svg.close({}) : svg.menu({})}
                </button>
                <div className="pr_header__brand">
                    <div>
                     <img src="/logo.png" alt="EventNest Logo" style={{  height: 40 }} />
                        <div className="pr_header__subtitle">Events overview</div>
                    </div>
                </div>
            </div>

            <div className="pr_header__right">
                <div className="pr_dropdown" ref={notifyRef}>
                    <Tooltip content={"Notifaction"}
                        placement="bottom"
                    >
                        <button
                            className="pr_icon_button pr_badge_button"
                            type="button"
                            onClick={() => setIsNotifyOpen((prev) => !prev)}
                            aria-label="Open notifications"
                        >
                            {svg.bell({})}
                            {notifications.length > 0 && (
                                <span className="pr_badge">{notifications.length}</span>
                            )}
                        </button>
                    </Tooltip>
                    {isNotifyOpen && (
                        <div className="pr_dropdown__panel">
                            <div className="pr_dropdown__header">
                                <div>Notifications</div>
                                <button type="button" className="pr_link_button" onClick={onMarkAllRead}>
                                    Mark all read
                                </button>
                            </div>
                            <div className="pr_dropdown__list">
                                {notifications.map((note) => (
                                    <div
                                        className="pr_dropdown__item"
                                        key={note.id || note._id}
                                        onClick={() => onNotificationClick(note)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="pr_dropdown__item_title">{note.title}</div>
                                        <div className="pr_dropdown__item_desc">{note.description || note.message}</div>
                                        <div className="pr_dropdown__item_time">{note.time || new Date(note.createdAt).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="pr_dropdown" ref={profileRef}>
                    <button
                        className="pr_profile_button"
                        type="button"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        aria-label="Open profile menu"
                    >
                        <span className="pr_profile_button__icon">{svg.user({})}</span>
                        <span className="pr_profile_button__text">
                            <span className="pr_profile_button__name">{user?.name || "User"}</span>
                            <span className="pr_profile_button__role">{userType}</span>
                        </span>
                        <span className="pr_profile_button__chevron">{svg.chevronDown({})}</span>
                    </button>
                    {isProfileOpen && (
                        <div className="pr_dropdown__panel">
                            <div className="pr_dropdown__list">
                                {
                                    userRole !== "admin" &&
                                    <button
                                        type="button"
                                        className="pr_dropdown__action"
                                        onClick={() => navigate("/user/settings")}
                                    >
                                        {svg.settings({})} Settings
                                    </button>
                                }
                                <button
                                    type="button"
                                    className="pr_dropdown__action pr_dropdown__danger"
                                    onClick={async () => {
                                        await apiCall({ url: "/auth/logout" });
                                        await UStore("user", null);
                                        await UStore("isAuthenticated", false);
                                        window.location.href = "/login"
                                    }}
                                >
                                    {svg.logout({})} Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
