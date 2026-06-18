import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/wrapper/Header";
import Sidebar from "./components/wrapper/Sidebar";
import useUserStore from "./store/useUserStore";
import { apiCall } from "./apiConfig/apiCall";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { user } = useUserStore();
    const isAdmin = user?.role === "admin";

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    const unreadNotifications = useMemo(
        () => notifications.filter((item) => item.status === "unread"),
        [notifications]
    );

    const loadShellData = async () => {
        if (!user) return;

        if (!isAdmin) {
            const notificationRes = await apiCall({ url: "/user/notifications?page=1&limit=10", method: "GET" });
            if (notificationRes?.success) {
                setNotifications(notificationRes?.data?.items || []);
            }
        }
    };

    useEffect(() => {
        loadShellData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id, isAdmin]);

    return (
        <div className="pr_layout">
            <Sidebar
                isOpen={isSidebarOpen}
                toggle={toggleSidebar}
                role={user?.role || "user"}
            />
            <div className="pr_layout__main">
                <Header
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    notifications={unreadNotifications}
                    onMarkAllRead={async () => {
                        if (isAdmin) return;
                        await apiCall({ url: "/user/notifications/read-all", method: "PATCH" });
                        await loadShellData();
                    }}
                    onNotificationClick={async (note) => {
                        if (isAdmin || !note?._id || note?.status === "read") return;
                        await apiCall({ url: `/user/notifications/${note._id}/read`, method: "PATCH" });
                        await loadShellData();
                    }}
                />
                <main className="pr_layout__content">
                    <Outlet />
                </main>
            </div>



            {isSidebarOpen && <div className="pr_sidebar__overlay" onClick={closeSidebar} />}
        </div>
    );
};

export default MainLayout;
