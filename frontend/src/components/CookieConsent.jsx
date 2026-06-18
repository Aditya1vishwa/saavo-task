import { useEffect, useState } from "react";
import svg from "../assets/svg";

const STORAGE_KEY = "pn_cookie_consent";

const COOKIE_CATEGORIES = [
  {
    key: "necessary",
    title: "Necessary",
    locked: true,
    desc: "Required to enable basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.",
  },
  {
    key: "functional",
    title: "Functional",
    desc: "Help perform certain functionalities like sharing content on social media, collecting feedback, and other third-party features.",
  },
  {
    key: "analytics",
    title: "Analytics",
    desc: "Used to understand how visitors interact with the site, helping us improve the booking experience with metrics like visitors, bounce rate, and traffic source.",
  },
  {
    key: "advertisement",
    title: "Advertisement",
    desc: "Used to provide visitors with customised ads based on the pages you visited previously and to analyse the effectiveness of ad campaigns.",
  },
];

const buildDefaults = (value) =>
  COOKIE_CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.locked ? true : value;
    return acc;
  }, {});

const readStoredConsent = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState(() => buildDefaults(false));

  useEffect(() => {
    if (!readStoredConsent()) {
      setShowBanner(true);
    }
  }, []);

  const persist = (choice) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...choice, updatedAt: new Date().toISOString() })
      );
    } catch {
      /* storage unavailable — consent simply won't be remembered */
    }
    setPrefs(choice);
    setShowPrefs(false);
    setShowBanner(false);
  };

  const acceptAll = () => persist(buildDefaults(true));
  const rejectAll = () => persist(buildDefaults(false));
  const savePrefs = () => persist(prefs);

  const toggleCategory = (key) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const openPrefs = () => {
    setPrefs(readStoredConsent() || buildDefaults(false));
    setShowPrefs(true);
  };

  if (!showBanner && !showPrefs) return null;

  return (
    <div className="ov_cookie">
      {showBanner && !showPrefs && (
        <div className="ov_cookie__banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
          <div className="ov_cookie__banner_body">
            <div className="ov_cookie__heading">
              {svg.shield({ width: 18, height: 18, fill: "#0369a1" })}
              <h2>We value your privacy</h2>
            </div>
            <p>
              We use cookies to enhance your browsing experience, serve personalised content, and
              analyse our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{" "}
              <a href="/privacy">Cookie Policy</a>
            </p>
          </div>
          <div className="ov_cookie__actions">
            <button type="button" className="ov_cookie__btn ov_cookie__btn--ghost" onClick={openPrefs}>
              Customise
            </button>
            <button type="button" className="ov_cookie__btn ov_cookie__btn--outline" onClick={rejectAll}>
              Reject All
            </button>
            <button type="button" className="ov_cookie__btn ov_cookie__btn--solid" onClick={acceptAll}>
              Accept All
            </button>
          </div>
        </div>
      )}

      {showPrefs && (
        <div className="ov_cookie__overlay" role="presentation" onClick={() => setShowPrefs(false)}>
          <div
            className="ov_cookie__modal"
            role="dialog"
            aria-modal="true"
            aria-label="Customise consent preferences"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ov_cookie__modal_head">
              <h2>Customise Consent Preferences</h2>
              <button
                type="button"
                className="ov_cookie__close"
                aria-label="Close preferences"
                onClick={() => setShowPrefs(false)}
              >
                {svg.close({ width: 18, height: 18, fill: "#64748b" })}
              </button>
            </div>

            <div className="ov_cookie__modal_body">
              <p className="ov_cookie__intro">
                We use cookies to help you navigate efficiently and perform certain functions. You will
                find detailed information about all cookies under each consent category below.
              </p>

              <div className="ov_cookie__list">
                {COOKIE_CATEGORIES.map((cat) => (
                  <div key={cat.key} className="ov_cookie__row">
                    <div className="ov_cookie__row_head">
                      <span className="ov_cookie__row_title">{cat.title}</span>
                      {cat.locked ? (
                        <span className="ov_cookie__always">Always Active</span>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={prefs[cat.key]}
                          aria-label={`Toggle ${cat.title} cookies`}
                          className={`ov_cookie__switch${prefs[cat.key] ? " is-on" : ""}`}
                          onClick={() => toggleCategory(cat.key)}
                        >
                          <span className="ov_cookie__switch_thumb" />
                        </button>
                      )}
                    </div>
                    <p className="ov_cookie__row_desc">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ov_cookie__modal_actions">
              <button type="button" className="ov_cookie__btn ov_cookie__btn--outline" onClick={rejectAll}>
                Reject All
              </button>
              <button type="button" className="ov_cookie__btn ov_cookie__btn--outline" onClick={savePrefs}>
                Save My Preferences
              </button>
              <button type="button" className="ov_cookie__btn ov_cookie__btn--solid" onClick={acceptAll}>
                Accept All
              </button>
            </div>

            <div className="ov_cookie__brandline">
              Powered by <strong>EventNest</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
