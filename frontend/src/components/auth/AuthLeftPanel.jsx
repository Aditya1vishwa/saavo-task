const AuthLeftPanel = () => {
    return (
        <div className="pr_auth_left_content">
            <span className="pr_auth_left_pill">Event Booking Platform</span>
            <h1 className="pr_app_name">EventNest</h1>
            <p className="pr_app_tagline">
                Discover events, pick your seats, and book tickets in seconds — all in one place.
            </p>

            <div className="pr_auth_left_features">
                <div className="pr_auth_left_feature">
                    <span className="pr_auth_left_dot" />
                    Real-time seat availability
                </div>
                <div className="pr_auth_left_feature">
                    <span className="pr_auth_left_dot" />
                    Secure checkout and instant confirmation
                </div>
                <div className="pr_auth_left_feature">
                    <span className="pr_auth_left_dot" />
                    Tickets and bookings in your dashboard
                </div>
            </div>

            <div className="pr_auth_left_stats">
                <div>
                    <strong>1000+</strong>
                    <span>events to explore</span>
                </div>
                <div>
                    <strong>5 min</strong>
                    <span>seat hold while you pay</span>
                </div>
                <div>
                    <strong>Instant</strong>
                    <span>booking confirmation</span>
                </div>
            </div>
        </div>
    );
};

export default AuthLeftPanel;
