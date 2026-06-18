import { useEffect } from "react";

/**
 * useMetadata – sets <title>, meta description, canonical URL, and Open Graph
 * tags dynamically for each page. Falls back to sensible defaults.
 *
 * @param {object} params
 * @param {string}  params.title        – Page <title> (suffix " | EventNest" added automatically)
 * @param {string}  [params.description]  – Meta description (≤160 chars recommended)
 * @param {string}  [params.canonical]    – Canonical URL for this page
 * @param {string}  [params.ogImage]      – Open Graph image URL
 * @param {boolean} [params.noIndex]      – Set true for auth/private pages
 */
export default function useMetadata({
    title,
    description,
    canonical,
    ogImage,
    noIndex = false,
}) {
    useEffect(() => {
        const SITE_NAME = "EventNest";
        const BASE_URL = "https://eventnest.app";
        const DEFAULT_DESC =
            "EventNest is an event booking platform. Discover events, choose your seats, and book tickets with instant confirmation.";
        const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

        const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Event Booking Platform`;
        const metaDesc = description || DEFAULT_DESC;
        const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : null;
        const ogImg = ogImage || DEFAULT_IMAGE;

        // ── <title> ──────────────────────────────────────────────────────
        document.title = fullTitle;

        // ── Helper ───────────────────────────────────────────────────────
        const setMeta = (selector, attr, value) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement("meta");
                const [attrName, attrVal] = selector
                    .replace(/[\[\]]/g, "")
                    .replace(/^meta/, "")
                    .trim()
                    .split("=");
                el.setAttribute(attrName.trim(), attrVal.replace(/"/g, "").trim());
                document.head.appendChild(el);
            }
            el.setAttribute(attr, value);
        };

        const setLink = (rel, href) => {
            let el = document.querySelector(`link[rel="${rel}"]`);
            if (!el) {
                el = document.createElement("link");
                el.setAttribute("rel", rel);
                document.head.appendChild(el);
            }
            el.setAttribute("href", href);
        };

        // ── Meta Description ─────────────────────────────────────────────
        setMeta('meta[name="description"]', "content", metaDesc);

        // ── Robots ───────────────────────────────────────────────────────
        setMeta('meta[name="robots"]', "content", noIndex ? "noindex, nofollow" : "index, follow");

        // ── Canonical ────────────────────────────────────────────────────
        if (canonicalUrl) {
            setLink("canonical", canonicalUrl);
        }

        // ── Open Graph ───────────────────────────────────────────────────
        setMeta('meta[property="og:title"]', "content", fullTitle);
        setMeta('meta[property="og:description"]', "content", metaDesc);
        setMeta('meta[property="og:image"]', "content", ogImg);
        if (canonicalUrl) {
            setMeta('meta[property="og:url"]', "content", canonicalUrl);
        }

        // ── Twitter Card ─────────────────────────────────────────────────
        setMeta('meta[name="twitter:title"]', "content", fullTitle);
        setMeta('meta[name="twitter:description"]', "content", metaDesc);
        setMeta('meta[name="twitter:image"]', "content", ogImg);

    }, [title, description, canonical, ogImage, noIndex]);
}