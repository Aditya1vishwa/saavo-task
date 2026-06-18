import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import svg from "../../assets/svg";
import SelectInput from "../../components/common/SelectInput";
import PublicTopbar from "../../components/wrapper/PublicTopbar";
import { eventsApi } from "../../api";
import { formatDate, formatMoney, bannerSrc } from "../../utils/format";
import "../../../styles/events.css";

const CATEGORY_OPTIONS = [
    { value: "", label: "All categories" },
    ...["Concert", "Theatre", "Sports", "Workshop", "Conference", "Comedy", "Other"].map((c) => ({ value: c, label: c })),
];
const SORT_OPTIONS = [
    { value: "soonest", label: "Date: Soonest" },
    { value: "newest", label: "Recently added" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

const EventCard = ({ ev }) => (
    <Link to={`/events/${ev._id}`} className="ev_card">
        <div className="ev_card__media">
            <img src={bannerSrc(ev.bannerUrl)} alt={ev.title} loading="lazy" />
            {ev.category && <span className="ev_card__chip">{ev.category}</span>}
        </div>
        <div className="ev_card__body">
            <h3 className="ev_card__title">{ev.title}</h3>
            <div className="ev_card__meta">
                <span className="ev_card__meta_ico">{svg.calendar({ fill: "#64748b", width: 15, height: 15 })}</span>
                {formatDate(ev.startAt)}
            </div>
            <div className="ev_card__meta">
                <span className="ev_card__meta_ico">{svg.mapPin({ fill: "#64748b", width: 15, height: 15 })}</span>
                {ev.venueId?.name ? `${ev.venueId.name}, ` : ""}{ev.city}
            </div>
            <div className="ev_card__price">From {formatMoney(ev.minPrice)}</div>
        </div>
    </Link>
);

const EventsBrowse = () => {
    const [searchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        city: "",
        category: "",
        sort: "soonest",
    });

    const load = useCallback(async (pageArg, f) => {
        setLoading(true);
        const params = { page: pageArg, limit: 12, sort: f.sort };
        if (f.search) params.search = f.search;
        if (f.city) params.city = f.city;
        if (f.category) params.category = f.category;
        const res = await eventsApi.discover(params);
        if (res?.success) {
            setEvents(res.data.events || []);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.page || 1);
        }
        setLoading(false);
    }, []);

    useEffect(() => { load(1, filters); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

    const applyFilters = (e) => {
        e?.preventDefault();
        load(1, filters);
    };

    return (
        <div className="ev_public">
            <PublicTopbar />

            <div className="ev_browse">
                <div className="ev_browse__head">
                    <div>
                        <h2>Discover events</h2>
                        <p>Find concerts, workshops, sports and more near you.</p>
                    </div>
                </div>

                <form className="ev_filters" onSubmit={applyFilters}>
                    <div className="ev_filters__search">
                        <span className="ev_filters__search_ico">{svg.search({ fill: "#94a3b8", width: 18, height: 18 })}</span>
                        <input
                            className="pr_input"
                            placeholder="Search events…"
                            value={filters.search}
                            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                        />
                    </div>
                    <input
                        className="pr_input ev_filters__city"
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                    />
                    <SelectInput
                        className="ev_filters__select"
                        options={CATEGORY_OPTIONS}
                        value={filters.category}
                        onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
                        placeholder="Category"
                    />
                    <SelectInput
                        className="ev_filters__select"
                        options={SORT_OPTIONS}
                        value={filters.sort}
                        onChange={(v) => setFilters((f) => ({ ...f, sort: v }))}
                        placeholder="Sort"
                    />
                    <button type="submit" className="pr_btn_primary">
                        {svg.search({ fill: "#fff", width: 16, height: 16 })} Search
                    </button>
                </form>

                {loading ? (
                    <div className="ev_empty">Loading events…</div>
                ) : events.length === 0 ? (
                    <div className="ev_empty">No events found. Try adjusting your filters.</div>
                ) : (
                    <>
                        <div className="ev_grid">
                            {events.map((ev) => <EventCard key={ev._id} ev={ev} />)}
                        </div>
                        {totalPages > 1 && (
                            <div className="ev_pagination">
                                <button className="pr_btn_secondary" disabled={page <= 1} onClick={() => load(page - 1, filters)}>Prev</button>
                                <span>Page {page} of {totalPages}</span>
                                <button className="pr_btn_secondary" disabled={page >= totalPages} onClick={() => load(page + 1, filters)}>Next</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventsBrowse;
