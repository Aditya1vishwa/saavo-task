import { imgDomain } from "../apiConfig/apiCall";

export const formatMoney = (amount, currency = "INR") => {
    const n = Number(amount) || 0;
    if (currency === "INR") return `₹${n.toLocaleString("en-IN")}`;
    return `${currency} ${n.toLocaleString()}`;
};

export const formatDate = (value, withTime = true) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const opts = withTime
        ? { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
        : { day: "numeric", month: "short", year: "numeric" };
    return d.toLocaleDateString("en-IN", opts);
};

// Resolve an event banner to an absolute URL (handles full URLs and bare keys).
export const bannerSrc = (url, fallback = "/event-placeholder.png") => {
    if (!url) return fallback;
    if (/^https?:\/\//i.test(url)) return url;
    return `${imgDomain}${url.replace(/^\/+/, "")}`;
};

export const statusBadgeClass = (status) => {
    const map = {
        published: "pr_badge--green",
        confirmed: "pr_badge--green",
        paid: "pr_badge--green",
        draft: "pr_badge--gray",
        pending: "pr_badge--amber",
        cancelled: "pr_badge--red",
        expired: "pr_badge--red",
        failed: "pr_badge--red",
        completed: "pr_badge--blue",
    };
    return map[status] || "pr_badge--gray";
};
