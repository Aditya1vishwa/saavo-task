import { Link } from "react-router";
import useUserStore from "../../store/useUserStore";

// Lightweight header for public (no-shell) pages like event discovery & detail.
const PublicTopbar = () => {
    const { isAuthenticated, user } = useUserStore();
    const dashHref = user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "organizer"
            ? "/organizer/dashboard"
            : "/user/dashboard";

    return (
        <header className="ev_topbar">
            <div className="ev_topbar__inner">
                <Link to="/" className="ev_topbar__brand">
                    <img src="/favicon.png" alt="EventNest" />
                    <span>EventNest</span>
                </Link>
                <nav className="ev_topbar__links">
                    <Link to="/events">Browse</Link>
                    {isAuthenticated ? (
                        <Link to={dashHref} className="pr_btn_primary ev_topbar__cta">Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login">Log in</Link>
                            <Link to="/signup" className="pr_btn_primary ev_topbar__cta">Sign up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default PublicTopbar;
