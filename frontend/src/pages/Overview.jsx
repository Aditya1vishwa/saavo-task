import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import svg from "../assets/svg";
import CookieConsent from "../components/CookieConsent";
import { eventsApi } from "../api";
import { formatDate, formatMoney, bannerSrc } from "../utils/format";
import "../../styles/overview.css";

const WHY = [
    { icon: svg.ticket, title: "Secure booking", desc: "Seats are held for you during checkout and confirmed the moment payment succeeds." },
    { icon: svg.seat, title: "Real-time seats", desc: "Live seat maps show exactly what's available — pick the spot you want." },
    { icon: svg.bolt, title: "Instant tickets", desc: "Get an instant confirmation and your booking in your dashboard right away." },
];

const Landing = () => {
    const navigate = useNavigate();
    const [featured, setFeatured] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        (async () => {
            const res = await eventsApi.discover({ page: 1, limit: 6, sort: "soonest" });
            if (res?.success) setFeatured(res.data.events || []);
        })();
    }, []);

    const search = (e) => {
        e.preventDefault();
        navigate(query ? `/events?search=${encodeURIComponent(query)}` : "/events");
    };

    return (
        <div className="lp">
            {/* Nav */}
            <header className="lp_nav">
                <div className="lp_nav__inner">
                    <Link to="/" className="lp_brand">
                        <img src="/favicon.png" alt="EventNest" />
                        <span>EventNest</span>
                    </Link>
                    <nav className="lp_nav__links">
                        <Link to="/events">Browse events</Link>
                        <Link to="/login">Log in</Link>
                        <Link to="/signup" className="pr_btn_primary">Sign up</Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="lp_hero">
                <div className="lp_hero__content">
                    <span className="lp_hero__pill">Discover · Book · Enjoy</span>
                    <h1>Book tickets to events <span className="lp_grad">you'll love</span>.</h1>
                    <p>Concerts, theatre, sports, workshops and more — find your next experience and reserve your seats in seconds.</p>
                    <form className="lp_search" onSubmit={search}>
                        <span className="lp_search__ico">{svg.search({ fill: "#94a3b8", width: 18, height: 18 })}</span>
                        <input
                            placeholder="Search events, artists, cities…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="pr_btn_primary">Search</button>
                    </form>
                    <div className="lp_hero__cta">
                        <Link to="/events" className="lp_link_strong">Explore all events {svg.arrowRight({ fill: "#004bd6", width: 16, height: 16 })}</Link>
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section className="lp_section">
                <div className="lp_section__head">
                    <h2>Trending & upcoming</h2>
                    <Link to="/events" className="lp_link_strong">See all {svg.arrowRight({ fill: "#004bd6", width: 16, height: 16 })}</Link>
                </div>
                {featured.length === 0 ? (
                    <div className="lp_empty">New events are coming soon — check back shortly.</div>
                ) : (
                    <div className="lp_grid">
                        {featured.map((ev) => (
                            <Link key={ev._id} to={`/events/${ev._id}`} className="lp_card">
                                <div className="lp_card__media">
                                    <img src={bannerSrc(ev.bannerUrl)} alt={ev.title} loading="lazy" />
                                    {ev.category && <span className="lp_card__chip">{ev.category}</span>}
                                </div>
                                <div className="lp_card__body">
                                    <h3>{ev.title}</h3>
                                    <div className="lp_card__meta">{formatDate(ev.startAt, false)} · {ev.city}</div>
                                    <div className="lp_card__price">From {formatMoney(ev.minPrice)}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Why choose us */}
            <section className="lp_section lp_why">
                <h2>Why book with EventNest</h2>
                <div className="lp_why__grid">
                    {WHY.map((w) => (
                        <div key={w.title} className="lp_why__card">
                            <div className="lp_why__icon">{w.icon({ fill: "#004bd6", width: 26, height: 26 })}</div>
                            <h3>{w.title}</h3>
                            <p>{w.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA band */}
            <section className="lp_cta">
                <div>
                    <h2>Ready to find your next event?</h2>
                    <p>Create a free account and start booking in minutes.</p>
                </div>
                <div className="lp_cta__actions">
                    <Link to="/signup" className="pr_btn_primary">Get started</Link>
                    <Link to="/events" className="pr_btn_secondary">Browse events</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp_footer">
                <div className="lp_footer__inner">
                    <div className="lp_brand">
                        <img src="/favicon.png" alt="EventNest" />
                        <span>EventNest</span>
                    </div>
                    <nav className="lp_footer__links">
                        <Link to="/events">Events</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/login">Log in</Link>
                    </nav>
                    <div className="lp_footer__copy">© 2026 EventNest. All rights reserved.</div>
                </div>
            </footer>

            <CookieConsent />
        </div>
    );
};

export default Landing;
