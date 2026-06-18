import { Link } from "react-router";
import "../../styles/legal.css";

const SUPPORT_EMAIL = "support@eventnest.app";

const TOC = [
    { id: "introduction", label: "Introduction" },
    { id: "data-collected", label: "Information We Collect" },
    { id: "payment-information", label: "Payment Information" },
    { id: "how-we-use", label: "How We Use Your Information" },
    { id: "sharing-organizers", label: "Sharing With Organizers" },
    { id: "third-parties", label: "Third-Party Services" },
    { id: "cookies", label: "Cookies & Tracking" },
    { id: "security", label: "Data Security" },
    { id: "retention", label: "Data Retention" },
    { id: "your-rights", label: "Your Rights" },
    { id: "children", label: "Children's Privacy" },
    { id: "international", label: "International Data Transfers" },
    { id: "changes", label: "Changes to This Policy" },
    { id: "contact", label: "Contact Us" },
];

const SECTIONS = [
    {
        id: "introduction",
        icon: "1",
        title: "Introduction",
        content: (
            <>
                <p className="legal_p">
                    Welcome to EventNest (&ldquo;EventNest,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
                </p>
                <p className="legal_p">
                    EventNest is an online event ticketing and booking platform that allows users to discover events, purchase tickets, and manage their bookings, while enabling organizers to list and sell tickets for their events.
                </p>
                <p className="legal_p">
                    We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, how we protect it, and the choices and rights available to you regarding your personal information.
                </p>
                <p className="legal_p">
                    By accessing or using EventNest&rsquo;s website, applications, or services (collectively, the &ldquo;Services&rdquo;), you acknowledge that you have read and understood this Privacy Policy.
                </p>
            </>
        ),
    },
    {
        id: "data-collected",
        icon: "2",
        title: "Information We Collect",
        content: (
            <>
                <p className="legal_p">
                    To provide our Services, we collect information that you voluntarily provide, information generated through your bookings, and certain information collected automatically through your device and browser.
                </p>

                <p className="legal_p"><strong>Account Information</strong></p>
                <p className="legal_p">
                    When you create an account or place a booking, we collect personal information such as your name, email address, and phone number. You may also provide additional profile details to personalize your experience.
                </p>

                <p className="legal_p"><strong>Booking History</strong></p>
                <p className="legal_p">
                    We collect and store information about the events you browse and book, including ticket types, quantities, booking dates, event details, attendee details you submit at checkout, and your transaction history. This allows us to deliver your tickets, provide booking confirmations, and offer support for past and upcoming events.
                </p>

                <p className="legal_p"><strong>Device and Usage Data</strong></p>
                <p className="legal_p">
                    When you access or use our Services, we may automatically collect certain technical information, including your IP address, device type, browser type, operating system, language preferences, referral URLs, session activity, usage patterns, and diagnostic information.
                </p>

                <p className="legal_p"><strong>Cookies</strong></p>
                <p className="legal_p">
                    We use cookies and similar technologies to maintain secure sessions, remember your preferences, and understand how the platform is used. You can read more about this in the Cookies &amp; Tracking section below.
                </p>
            </>
        ),
    },
    {
        id: "payment-information",
        icon: "3",
        title: "Payment Information",
        content: (
            <>
                <p className="legal_p">
                    Payments for ticket purchases are processed securely through a third-party payment gateway. We do not collect or store complete card numbers, banking credentials, CVV codes, or other sensitive payment authentication data on our systems.
                </p>
                <p className="legal_p">
                    For each transaction, we may store limited payment-related information necessary for order management and reconciliation, such as the payment status, the last four digits of the card used, the payment method type, and the transaction or order reference number provided by the payment gateway.
                </p>
                <div className="legal_highlight">
                    Your full card details are handled directly by our payment gateway in accordance with applicable payment-industry security standards and are never stored on EventNest&rsquo;s servers.
                </div>
            </>
        ),
    },
    {
        id: "how-we-use",
        icon: "4",
        title: "How We Use Your Information",
        content: (
            <>
                <p className="legal_p">
                    We use the information we collect for legitimate business and operational purposes related to providing and improving our Services.
                </p>
                <p className="legal_p">
                    Specifically, we use your information to process bookings and payments, deliver your tickets, send booking confirmations, reminders, and important updates about events you have booked, manage your account, and provide customer support.
                </p>
                <p className="legal_p">
                    We also use information to maintain platform security, detect and prevent fraud, prevent misuse, comply with legal and financial obligations, enforce our Terms of Service, and analyze usage to improve our Services and develop new features.
                </p>
                <p className="legal_p">
                    Where permitted by applicable law, we may use aggregated and anonymized data for analytics, reporting, and product development. Such information does not identify individual users.
                </p>
            </>
        ),
    },
    {
        id: "sharing-organizers",
        icon: "5",
        title: "Sharing With Organizers",
        content: (
            <>
                <p className="legal_p">
                    When you book a ticket for an event, we share certain booking information with the organizer of that event so they can manage entry and check-in.
                </p>
                <p className="legal_p">
                    This typically includes the attendee name and the booking details necessary for verification at the venue, such as the ticket type, quantity, and booking reference. Organizers receive only the information reasonably required to admit attendees and operate their event.
                </p>
                <p className="legal_p">
                    Organizers are independent parties responsible for their own handling of attendee information. We encourage you to review an organizer&rsquo;s own privacy practices where applicable. We do not sell your personal information to third parties.
                </p>
            </>
        ),
    },
    {
        id: "third-parties",
        icon: "6",
        title: "Third-Party Services",
        content: (
            <>
                <p className="legal_p">
                    We rely on trusted third-party service providers to operate the platform. These providers are authorized to access information only as necessary to perform services on our behalf and are contractually obligated to protect its confidentiality and security.
                </p>
                <p className="legal_p">
                    The categories of providers we use include:
                </p>
                <ul className="legal_list">
                    <li><strong>Payment gateway</strong> &mdash; to securely process ticket payments and refunds.</li>
                    <li><strong>Email delivery</strong> &mdash; to send booking confirmations, tickets, reminders, and service communications.</li>
                    <li><strong>Cloud hosting and storage</strong> &mdash; to host the platform and securely store booking and account data.</li>
                </ul>
                <p className="legal_p">
                    We may also disclose information when required by law, court order, governmental request, or where disclosure is necessary to protect our legal rights, prevent fraud, or protect users and the public.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        icon: "7",
        title: "Cookies & Tracking",
        content: (
            <>
                <p className="legal_p">
                    EventNest uses cookies, local storage, and similar technologies to provide functionality, maintain secure sessions, remember your preferences, and understand how the platform is used. We group cookies into the following categories:
                </p>
                <ul className="legal_list">
                    <li><strong>Necessary</strong> &mdash; required for core functionality such as authentication, secure sessions, and completing bookings. These cannot be disabled.</li>
                    <li><strong>Functional</strong> &mdash; remember your preferences and choices to enhance your experience.</li>
                    <li><strong>Analytics</strong> &mdash; help us understand traffic and usage patterns so we can improve the platform.</li>
                    <li><strong>Advertisement</strong> &mdash; used to measure and personalize promotional content where applicable.</li>
                </ul>
                <p className="legal_p">
                    You can manage your cookie preferences through our consent banner, and most browsers allow you to control or disable cookies through their settings. Disabling certain cookies may affect the availability of some features.
                </p>
            </>
        ),
    },
    {
        id: "security",
        icon: "8",
        title: "Data Security",
        content: (
            <>
                <p className="legal_p">
                    Protecting your information is a priority for us. We implement commercially reasonable administrative, technical, and organizational measures designed to safeguard personal information against unauthorized access, disclosure, alteration, misuse, or destruction.
                </p>
                <p className="legal_p">
                    These safeguards include encryption of data in transit, access controls, authentication mechanisms, secure cloud environments, and restrictions on employee access to personal information.
                </p>
                <p className="legal_p">
                    Despite these efforts, no system or method of electronic transmission can be guaranteed to be completely secure. You should also take reasonable precautions to protect your account credentials and devices.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        icon: "9",
        title: "Data Retention",
        content: (
            <>
                <p className="legal_p">
                    We retain personal information for as long as your account remains active and as needed to provide the Services, manage your bookings, and support you.
                </p>
                <p className="legal_p">
                    We may retain certain information for longer periods where required to comply with legal, tax, accounting, or financial record-keeping obligations, resolve disputes, and enforce our agreements.
                </p>
                <p className="legal_p">
                    When information is no longer required, we delete, anonymize, or securely archive it in accordance with our data retention practices.
                </p>
            </>
        ),
    },
    {
        id: "your-rights",
        icon: "10",
        title: "Your Rights",
        content: (
            <>
                <p className="legal_p">
                    Depending on your location and applicable laws &mdash; including the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and India&rsquo;s Digital Personal Data Protection Act, 2023 (DPDP) &mdash; you may have certain rights regarding your personal information.
                </p>
                <p className="legal_p">
                    These rights may include the right to access the personal information we hold about you, request correction of inaccurate information, request deletion of your personal information, and withdraw consent where processing is based on consent. Withdrawing consent may affect your ability to use certain Services.
                </p>
                <p className="legal_p">
                    To exercise any of these rights, please contact us at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>{SUPPORT_EMAIL}</a>. We may request verification of your identity before processing certain requests. EventNest does not sell personal information.
                </p>
            </>
        ),
    },
    {
        id: "children",
        icon: "11",
        title: "Children's Privacy",
        content: (
            <>
                <p className="legal_p">
                    EventNest is not intended for individuals under the age of 18, and we do not knowingly collect personal information from minors.
                </p>
                <p className="legal_p">
                    If you are under 18, please do not use the Services or provide any personal information. If we become aware that we have collected personal information from a minor without appropriate authorization, we will take reasonable steps to remove it.
                </p>
            </>
        ),
    },
    {
        id: "international",
        icon: "12",
        title: "International Data Transfers",
        content: (
            <>
                <p className="legal_p">
                    EventNest may use service providers and cloud infrastructure located in different countries. As a result, your information may be transferred to, stored in, or processed in jurisdictions outside your country of residence.
                </p>
                <p className="legal_p">
                    When such transfers occur, we take reasonable steps to ensure that appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        icon: "13",
        title: "Changes to This Policy",
        content: (
            <>
                <p className="legal_p">
                    We may update this Privacy Policy from time to time to reflect changes in our Services, legal requirements, technology, or business practices.
                </p>
                <p className="legal_p">
                    When material changes are made, we will update the date shown at the top of this Privacy Policy and may provide additional notice where required by law.
                </p>
                <p className="legal_p">
                    Your continued use of the Services after any updates become effective constitutes acceptance of the revised Privacy Policy.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        icon: "14",
        title: "Contact Us",
        content: (
            <div className="legal_contact_box">
                <p>If you have any questions, requests, concerns, or complaints regarding this Privacy Policy or our data handling practices, please contact us at:</p>
                <p><strong>EventNest</strong></p>
                <p>Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
                <p>If you wish to request access, correction, or deletion of your personal information, please contact us using the email address above and include sufficient information for us to process your request.</p>
            </div>
        ),
    },
];

const PrivacyPolicy = () => {
    return (
        <div className="legal_root">
            {/* Nav */}
            <nav className="legal_nav" aria-label="Legal navigation">
                <div className="legal_nav__inner">
                    <Link to="/" className="legal_nav__brand">
                                        <img src={"logo.png"} alt="" width="130" className="ov_brand__icon" />
                    </Link>
                    <Link to="/" className="legal_nav__back">
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="legal_hero">
                <div className="legal_hero__inner">
                    <span className="legal_hero__tag">Legal</span>
                    <h1 className="legal_hero__h1">Privacy Policy</h1>
                    <p className="legal_hero__meta">Effective date: June 18, 2026 &nbsp;·&nbsp; Last updated: June 18, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="legal_layout">
                {/* TOC */}
                <aside className="legal_toc" aria-label="Table of contents">
                    <p className="legal_toc__title">On this page</p>
                    <ol className="legal_toc__list">
                        {TOC.map((item) => (
                            <li key={item.id}>
                                <a href={`#${item.id}`}>{item.label}</a>
                            </li>
                        ))}
                    </ol>
                </aside>

                {/* Document */}
                <article className="legal_doc">
                    {SECTIONS.map((sec) => (
                        <section key={sec.id} id={sec.id} className="legal_section">
                            <h2 className="legal_section__heading">
                                <span>{sec.icon}</span>
                                {sec.title}
                            </h2>
                            {sec.content}
                        </section>
                    ))}
                </article>
            </div>

            {/* Footer */}
            <footer className="legal_footer">
                <div className="legal_footer__inner">
                    <p className="legal_footer__copy">© 2026 EventNest. All rights reserved.</p>
                    <nav className="legal_footer__links" aria-label="Legal links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <a href={`mailto:${SUPPORT_EMAIL}`}>Support</a>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
