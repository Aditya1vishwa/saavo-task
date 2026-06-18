import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import useUserStore from './store/useUserStore';
import { apiCall } from './apiConfig/apiCall';
// routes that should be treated as authentication screens
const AUTH_PAGES = ['/login', '/signup', '/forget', '/reset'];
// routes that are public and should not trigger an auth API check
const PUBLIC_PAGES = ['/privacy', '/terms', "/"];
// public route prefixes (anything under these is browsable without auth)
const PUBLIC_PREFIXES = ['/events'];
const isPublicPath = (path) =>
    path === '/' || PUBLIC_PAGES.includes(path) || PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

const getDefaultRouteByRole = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "organizer") return "/organizer/dashboard";
    return "/user/dashboard";
};

const AuthLayout = () => {
    const { UStore, loading, isAuthenticated, user } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();
    const intervalRef = useRef(null);
    // Track whether we've done the initial check so we don't double-fetch on mount
    const initialCheckDoneRef = useRef(false);

    const checkAuth = async ({ silent = false } = {}) => {
        try {
            if (!silent) await UStore('loading', true);
            // The accessToken cookie is httpOnly (not readable by JS), so we can't
            // gate on it client-side. Always ask the server — the browser sends the
            // cookie automatically (credentials: include). 401 → not authenticated.
            const response = await apiCall({ url: '/auth/me' });

            if (response?.success) {
                await UStore('user', response.data.user);
                await UStore('isAuthenticated', true);
                if (!silent) await UStore('loading', false);
                return { ok: true, user: response.data.user };
            }

            await UStore('user', null);
            await UStore('isAuthenticated', false);
            if (!silent) await UStore('loading', false);
            return { ok: false, user: null };
        } catch (error) {
            await UStore('user', null);
            await UStore('isAuthenticated', false);
            if (!silent) await UStore('loading', false);
            return { ok: false, user: null };
        }
    };

    const getRoleGuardRedirect = (path, currentUser) => {
        if (!currentUser) return null;
        const role = currentUser?.role;
        const isAdmin = role === "admin";
        const isOrganizer = role === "organizer";
        const isAdminRoute = path.startsWith("/admin/");
        const isOrganizerRoute = path.startsWith("/organizer/");
        // Public/shared routes any authenticated user may view.
        if (path === "/" || AUTH_PAGES.includes(path) || isPublicPath(path)) return null;

        if (isAdmin) return isAdminRoute ? null : "/admin/dashboard";
        if (isAdminRoute) return getDefaultRouteByRole(role);
        if (isOrganizerRoute && !isOrganizer) return "/user/dashboard";
        return null;
    };

    // ── Initial auth check + route guard on every path change ──────────────────
    useEffect(() => {
        const path = location.pathname;
        const isAuthPage = AUTH_PAGES.includes(path);
        const isPublicPage = isPublicPath(path);

        const run = async () => {
            // If isAuthenticated is already true from a prior successful login
            // (e.g. login.jsx set the store), skip hitting the network again
            // and just redirect auth pages away. For protected pages trust the store.
            if (initialCheckDoneRef.current && isAuthenticated && user) {
                const roleRedirect = getRoleGuardRedirect(path, user);
                if (roleRedirect && roleRedirect !== path) {
                    navigate(roleRedirect, { replace: true });
                    return;
                }
                if (isAuthPage) {
                    navigate(getDefaultRouteByRole(user.role), { replace: true });
                }
                return;
            }

            // Public pages (/, /terms, /privacy, /events*) and auth pages
            // (/login, /signup, /forget, /reset) never hit the auth API.
            if (isPublicPage || isAuthPage) {
                initialCheckDoneRef.current = true;
                return;
            }

            // Protected pages → validate with the server.
            const authResult = await checkAuth({ silent: false });

            initialCheckDoneRef.current = true;

            if (authResult.ok && authResult.user) {
                const roleRedirect = getRoleGuardRedirect(path, authResult.user);
                if (roleRedirect && roleRedirect !== path) {
                    navigate(roleRedirect, { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        };

        run();
        // Only re-run when the path changes — NOT on isAuthenticated change to
        // avoid re-fetching every time we set store values.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // ── Periodic silent re-sync every 60s (to detect session expiry) ──────────
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            const path = location.pathname;
            if (isPublicPath(path) || AUTH_PAGES.includes(path)) return;

            const authResult = await checkAuth({ silent: true });
            if (!authResult.ok) {
                if (!AUTH_PAGES.includes(path)) {
                    navigate('/login', { replace: true });
                }
                return;
            }

            const roleRedirect = getRoleGuardRedirect(path, authResult.user);
            if (roleRedirect && roleRedirect !== path) {
                navigate(roleRedirect, { replace: true });
            }
        }, 60000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, user, isAuthenticated]);

    if (loading) {
        return (
            <div className="pr_auth_layout">
                <div className="pr_loader">Loading...</div>
            </div>
        );
    }

    return (
        <div className="pr_auth_layout">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
