/* eslint-disable react-refresh/only-export-components -- app entry module: defines route helpers + lazy page chunks, never fast-refreshed */
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from 'react-hot-toast';
import useMetadata from './useMetaHandler';

// Layout shells stay eager — they're small and frame every page.
import AuthLayout from './AuthLayout';
import MainLayout from './MainLayout';
import FullScreenLoader from './components/common/FullScreenLoader';

// ── Lazy-loaded pages (code-split into per-route chunks) ──────────────────────
const Login = lazy(() => import('./pages/auth/login'));
const Signup = lazy(() => import('./pages/auth/signup'));
const Forget = lazy(() => import('./pages/auth/forget'));
const Reset = lazy(() => import('./pages/auth/reset'));
const Overview = lazy(() => import('./pages/Overview'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// Public event discovery
const EventsBrowse = lazy(() => import('./pages/events/EventsBrowse'));
const EventDetail = lazy(() => import('./pages/events/EventDetail'));

// Attendee (authenticated)
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const UserSettings = lazy(() => import('./pages/user/settings/UserSettings'));
const HelpSupport = lazy(() => import('./pages/user/HelpSupport'));
const MyBookings = lazy(() => import('./pages/bookings/MyBookings'));
const BookingDetail = lazy(() => import('./pages/bookings/BookingDetail'));
const Checkout = lazy(() => import('./pages/bookings/Checkout'));

// Organizer
const OrganizerDashboard = lazy(() => import('./pages/organizer/OrganizerDashboard'));
const OrganizerEvents = lazy(() => import('./pages/organizer/OrganizerEvents'));
const EventManage = lazy(() => import('./pages/organizer/EventManage'));
const OrganizerVenues = lazy(() => import('./pages/organizer/OrganizerVenues'));

// Admin
const Dhasboard = lazy(() => import('./pages/admin/Dhasboard'));
const Users = lazy(() => import('./pages/admin/Users'));
const KeyValueType = lazy(() => import('./pages/admin/KeyValueType'));
const HelpDesk = lazy(() => import('./pages/admin/HelpDesk'));

/**
 * WithMeta – wraps each page with per-route SEO metadata + a Suspense boundary.
 */
// eslint-disable-next-line no-unused-vars -- `Component` is used below as a JSX tag (<Component />)
const WithMeta = ({ title, description, canonical, noIndex = false, Component }) => {
  useMetadata({ title, description, canonical, noIndex });
  return (
    <Suspense fallback={<FullScreenLoader headingText="Loading…" />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <WithMeta title="Event Booking Platform" description="Discover, book, and manage event tickets." canonical="/" Component={Overview} /> },
      { path: "login", element: <WithMeta title="Log In" description="Log in to your account." canonical="/login" noIndex Component={Login} /> },
      { path: "signup", element: <WithMeta title="Create Account" description="Sign up to start booking events." canonical="/signup" Component={Signup} /> },
      { path: "forget", element: <WithMeta title="Forgot Password" description="Reset your account password." canonical="/forget" noIndex Component={Forget} /> },
      { path: "reset", element: <WithMeta title="Reset Password" description="Set a new password for your account." canonical="/reset" noIndex Component={Reset} /> },
      { path: "terms", element: <WithMeta title="Terms & Conditions" description="Read our Terms and Conditions." canonical="/terms" Component={TermsAndConditions} /> },
      { path: "privacy", element: <WithMeta title="Privacy Policy" description="Read our Privacy Policy." canonical="/privacy" Component={PrivacyPolicy} /> },

      // ── Public event discovery ──
      { path: "events", element: <WithMeta title="Browse Events" description="Discover and book events." canonical="/events" Component={EventsBrowse} /> },
      { path: "events/:id", element: <WithMeta title="Event Details" description="Event details and seat booking." Component={EventDetail} /> },

      {
        element: <MainLayout />,
        children: [
          // ── Attendee ──
          { path: "user/dashboard", element: <WithMeta title="Dashboard" noIndex Component={Dashboard} /> },
          { path: "user/bookings", element: <WithMeta title="My Bookings" noIndex Component={MyBookings} /> },
          { path: "user/bookings/:id", element: <WithMeta title="Booking" noIndex Component={BookingDetail} /> },
          { path: "user/settings", element: <WithMeta title="Settings" noIndex Component={UserSettings} /> },
          { path: "user/help", element: <WithMeta title="Help & Support" noIndex Component={HelpSupport} /> },
          { path: "checkout/:bookingId", element: <WithMeta title="Checkout" noIndex Component={Checkout} /> },

          // ── Organizer ──
          { path: "organizer/dashboard", element: <WithMeta title="Organizer Dashboard" noIndex Component={OrganizerDashboard} /> },
          { path: "organizer/events", element: <WithMeta title="My Events" noIndex Component={OrganizerEvents} /> },
          { path: "organizer/events/:id", element: <WithMeta title="Manage Event" noIndex Component={EventManage} /> },
          { path: "organizer/venues", element: <WithMeta title="Venues" noIndex Component={OrganizerVenues} /> },

          // ── Admin ──
          { path: "admin/dashboard", element: <WithMeta title="Admin Dashboard" noIndex Component={Dhasboard} /> },
          { path: "admin/users", element: <WithMeta title="Manage Users" noIndex Component={Users} /> },
          { path: "admin/key-values", element: <WithMeta title="Key Values" noIndex Component={KeyValueType} /> },
          { path: "admin/helpdesk", element: <WithMeta title="Help Desk" noIndex Component={HelpDesk} /> },
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <>
    <Toaster position="top-center" />
    <RouterProvider router={router} />
  </>
)
