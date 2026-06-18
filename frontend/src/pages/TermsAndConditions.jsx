import { Link } from "react-router";
import "../../styles/legal.css";

const SUPPORT_EMAIL = "support@eventnest.app";

const TOC = [
    { id: "introduction", label: "Introduction" },
    { id: "eligibility", label: "Eligibility" },
    { id: "description", label: "Description of Services" },
    { id: "accounts", label: "User Accounts" },
    { id: "booking", label: "Booking Policy" },
    { id: "pricing", label: "Pricing & Payments" },
    { id: "cancellation", label: "Cancellation Policy" },
    { id: "refunds", label: "Refund Policy" },
    { id: "tickets", label: "Tickets & Entry" },
    { id: "conduct", label: "User Responsibilities & Acceptable Use" },
    { id: "organizers", label: "Organizer Responsibilities" },
    { id: "ip", label: "Intellectual Property" },
    { id: "warranties", label: "Disclaimer of Warranties" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "indemnification", label: "Indemnification" },
    { id: "termination", label: "Suspension and Termination" },
    { id: "changes", label: "Changes to the Services and Terms" },
    { id: "governing", label: "Governing Law and Jurisdiction" },
    { id: "contact", label: "Contact Information" },
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
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of EventNest&rsquo;s website, applications, software, content, and related services (collectively, the &ldquo;Services&rdquo;), through which you can discover events and book tickets.
                </p>
                <p className="legal_p">
                    By creating an account, accessing, or using the Services, you agree to be legally bound by these Terms. If you do not agree with any part of these Terms, you must not access or use the Services.
                </p>
                <p className="legal_p">
                    These Terms constitute a legally binding agreement between you and EventNest.
                </p>
            </>
        ),
    },
    {
        id: "eligibility",
        icon: "2",
        title: "Eligibility",
        content: (
            <>
                <p className="legal_p">
                    To use the Services and book tickets, you must be at least 18 years of age and legally capable of entering into a binding agreement under applicable law.
                </p>
                <p className="legal_p">By using the Services, you represent and warrant that:</p>
                <ul className="legal_ul">
                    <li>You are at least 18 years old.</li>
                    <li>You have the legal authority to enter into these Terms.</li>
                    <li>All information you provide, including booking and payment details, is accurate, current, and complete.</li>
                    <li>You will comply with all applicable laws, regulations, and venue or organizer requirements while using the Services.</li>
                </ul>
                <p className="legal_p">
                    Certain events may impose additional age restrictions set by the organizer or venue, which you must also satisfy.
                </p>
            </>
        ),
    },
    {
        id: "description",
        icon: "3",
        title: "Description of Services",
        content: (
            <>
                <p className="legal_p">
                    EventNest is an online platform that connects users with event organizers, enabling users to discover events and purchase tickets. Our Services include, but are not limited to:
                </p>
                <ul className="legal_ul">
                    <li>Event discovery and browsing across categories, locations, and dates</li>
                    <li>Online ticket booking and checkout</li>
                    <li>Seat selection and reserved seating, where available</li>
                    <li>Digital ticket delivery and order management</li>
                    <li>Secure payment processing for bookings</li>
                    <li>Booking history and account management tools</li>
                </ul>
                <p className="legal_p">
                    EventNest acts as an intermediary booking platform. Events are organized and hosted by independent third-party organizers, who are responsible for the events themselves. We may modify, suspend, replace, or discontinue any feature or functionality at any time without liability.
                </p>
            </>
        ),
    },
    {
        id: "accounts",
        icon: "4",
        title: "User Accounts",
        content: (
            <>
                <p className="legal_p">
                    You may be required to create an account to book tickets and access certain Services.
                </p>
                <p className="legal_p">
                    You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account, including all bookings made.
                </p>
                <p className="legal_p">
                    You agree to notify us immediately at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>{SUPPORT_EMAIL}</a> if you become aware of any unauthorized access, misuse, or security breach involving your account.
                </p>
                <p className="legal_p">
                    EventNest is not responsible for losses arising from unauthorized use of your account caused by your failure to safeguard account credentials.
                </p>
            </>
        ),
    },
    {
        id: "booking",
        icon: "5",
        title: "Booking Policy",
        content: (
            <>
                <p className="legal_p">
                    When you select seats or tickets and proceed to checkout, those seats or tickets are temporarily held for you.
                </p>
                <ul className="legal_ul">
                    <li>Seat and ticket holds expire automatically after five (5) minutes during checkout. If payment is not completed within this window, the held seats or tickets are released and made available to other users.</li>
                    <li>A booking is confirmed only after your payment has been successfully processed and you receive a booking confirmation. Initiating a booking or holding seats does not by itself guarantee a confirmed reservation.</li>
                    <li>Once confirmed, tickets are non-transferable unless the organizer or the applicable event listing expressly states otherwise.</li>
                    <li>Availability is subject to real-time demand, and we do not guarantee that any particular event, seat, or ticket type will remain available until you complete checkout.</li>
                </ul>
                <p className="legal_p">
                    EventNest reserves the right to cancel or refuse any booking that we reasonably believe to be fraudulent, erroneous, or in violation of these Terms.
                </p>
            </>
        ),
    },
    {
        id: "pricing",
        icon: "6",
        title: "Pricing & Payments",
        content: (
            <>
                <p className="legal_p">
                    Ticket prices are set by the respective event organizers and are displayed on the relevant event listing.
                </p>
                <ul className="legal_ul">
                    <li>The total amount payable at checkout may include applicable taxes, convenience fees, booking fees, and other charges, which will be shown before you confirm your booking.</li>
                    <li>All payments are processed securely through the platform&rsquo;s integrated payment gateway. You authorize us and our payment processors to charge the total amount to your selected payment method.</li>
                    <li>You are responsible for ensuring that the payment information you provide is accurate and that you are authorized to use the chosen payment method.</li>
                    <li>Prices and fees may change at any time before a booking is confirmed; the price applicable to your booking is the one displayed at the time of confirmed payment.</li>
                </ul>
                <p className="legal_p">
                    If a payment fails, is reversed, or is charged back without valid cause, we may cancel the associated booking and tickets.
                </p>
            </>
        ),
    },
    {
        id: "cancellation",
        icon: "7",
        title: "Cancellation Policy",
        content: (
            <>
                <p className="legal_p">
                    Cancellation of confirmed bookings is governed by the cancellation policy displayed on the relevant event listing at the time of booking.
                </p>
                <ul className="legal_ul">
                    <li>Where an event permits user cancellations, you may cancel a confirmed booking only within the cancellation window and subject to any conditions specified for that event.</li>
                    <li>Some events are marked as non-cancellable, in which case bookings cannot be cancelled by the user once confirmed.</li>
                    <li>Organizers may cancel, postpone, reschedule, or materially change an event (including changes to date, time, venue, or lineup). EventNest will use reasonable efforts to notify you of such changes using the contact details associated with your account.</li>
                    <li>If an event is cancelled or materially changed by the organizer, your eligibility for a refund or an alternative is determined under the Refund Policy below.</li>
                </ul>
            </>
        ),
    },
    {
        id: "refunds",
        icon: "8",
        title: "Refund Policy",
        content: (
            <>
                <p className="legal_p">
                    Refunds are handled in accordance with this policy and the specific terms of each event.
                </p>
                <ul className="legal_ul">
                    <li>If you cancel a booking within the applicable cancellation window for that event, you may be eligible for a refund, which may be subject to deductions for non-refundable convenience or booking fees as disclosed at checkout.</li>
                    <li>If an organizer cancels an event, eligible bookings will generally be refunded. Where an event is rescheduled, your original ticket may remain valid for the new date, or a refund may be offered, depending on the organizer&rsquo;s decision.</li>
                    <li>Approved refunds are processed to the original payment method. Refund processing timelines depend on your bank or payment provider and may typically take five (5) to fourteen (14) business days to reflect after the refund is initiated.</li>
                    <li>Convenience fees, booking fees, and taxes may be non-refundable except where required by applicable law or expressly stated otherwise.</li>
                </ul>
                <p className="legal_p">
                    For refund queries, contact us at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>{SUPPORT_EMAIL}</a>.
                </p>
            </>
        ),
    },
    {
        id: "tickets",
        icon: "9",
        title: "Tickets & Entry",
        content: (
            <>
                <p className="legal_p">
                    Once a booking is confirmed, your tickets are issued digitally and may be delivered as a QR code, a PDF ticket, or both, accessible through your account.
                </p>
                <ul className="legal_ul">
                    <li>Each ticket is valid for a single entry. The QR code on a ticket can be scanned once for admission; duplicate or copied tickets bearing the same code will not be admitted.</li>
                    <li>You may be required to carry a valid government-issued photo ID and present your digital ticket at the venue for verification.</li>
                    <li>Re-entry to a venue after exiting may not be permitted and is subject to the rules set by the organizer or venue.</li>
                    <li>You are responsible for keeping your ticket and its QR code confidential. Anyone who presents your ticket QR code may be granted entry, and we are not liable for entry obtained using a ticket you have shared or exposed.</li>
                </ul>
                <p className="legal_p">
                    Admission remains subject to the organizer&rsquo;s and venue&rsquo;s terms, security checks, and applicable laws.
                </p>
            </>
        ),
    },
    {
        id: "conduct",
        icon: "10",
        title: "User Responsibilities & Acceptable Use",
        content: (
            <>
                <p className="legal_p">You agree to use the Services only for lawful purposes. You must not:</p>
                <ul className="legal_ul">
                    <li>Make fraudulent, duplicate, or unauthorized bookings.</li>
                    <li>Use stolen, invalid, or unauthorized payment information.</li>
                    <li>Resell, scalp, or commercially redistribute tickets, or book tickets for the purpose of unauthorized resale.</li>
                    <li>Use bots, scripts, or automated tools to book tickets or access the platform in an unauthorized manner.</li>
                    <li>Attempt to gain unauthorized access to systems, accounts, or data, or interfere with platform functionality or security.</li>
                    <li>Upload malicious software or harmful code, or circumvent platform limitations or security controls.</li>
                    <li>Violate any applicable law, regulation, or the rules of an event or venue.</li>
                </ul>
                <p className="legal_p">
                    Violation of these Terms may result in cancellation of bookings without refund, suspension or termination of your account, and legal action.
                </p>
            </>
        ),
    },
    {
        id: "organizers",
        icon: "11",
        title: "Organizer Responsibilities",
        content: (
            <>
                <p className="legal_p">
                    Event organizers are independent third parties responsible for the events they list and remain solely responsible for:
                </p>
                <ul className="legal_ul">
                    <li>The accuracy of event details, including date, time, venue, lineup, pricing, and policies.</li>
                    <li>Honoring valid tickets purchased through the Services and admitting ticket holders in accordance with the event terms.</li>
                    <li>Conducting the event and complying with all applicable laws, permits, and safety requirements.</li>
                </ul>
                <p className="legal_p">
                    EventNest is not the organizer of events and is not responsible for the conduct, cancellation, or quality of any event, except as expressly stated in these Terms.
                </p>
            </>
        ),
    },
    {
        id: "ip",
        icon: "12",
        title: "Intellectual Property",
        content: (
            <>
                <p className="legal_p">
                    All rights, title, and interest in and to the Services, including software, technology, designs, trademarks, logos, branding, content, interfaces, and documentation, are owned by or licensed to EventNest.
                </p>
                <p className="legal_p">
                    Nothing in these Terms transfers ownership of any intellectual property to users.
                </p>
                <p className="legal_p">
                    You may not reproduce, modify, distribute, sell, lease, sublicense, or commercially exploit any portion of the Services without prior written permission.
                </p>
            </>
        ),
    },
    {
        id: "warranties",
        icon: "13",
        title: "Disclaimer of Warranties",
        content: (
            <>
                <div className="legal_highlight">
                    The Services are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis.
                </div>
                <p className="legal_p">
                    To the maximum extent permitted by law, EventNest disclaims all warranties, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, reliability, and uninterrupted operation.
                </p>
                <p className="legal_p">
                    We do not guarantee that the Services will be error-free, uninterrupted, or secure, nor do we warrant the quality, safety, or occurrence of any event listed on the platform.
                </p>
            </>
        ),
    },
    {
        id: "liability",
        icon: "14",
        title: "Limitation of Liability",
        content: (
            <>
                <p className="legal_p">
                    To the fullest extent permitted by law, EventNest, its affiliates, directors, employees, partners, and licensors shall not be liable for:
                </p>
                <ul className="legal_ul">
                    <li>Cancellation, postponement, or changes to any event by an organizer</li>
                    <li>The conduct, quality, or safety of any event or venue</li>
                    <li>Loss of profits, revenue, or business opportunities</li>
                    <li>Data loss or service interruptions</li>
                    <li>Inability to attend an event for reasons outside our control</li>
                    <li>Indirect, incidental, special, consequential, or punitive damages</li>
                </ul>
                <p className="legal_p">
                    Our total cumulative liability arising from or related to the Services shall not exceed the total amount paid by you for the specific booking giving rise to the claim.
                </p>
            </>
        ),
    },
    {
        id: "indemnification",
        icon: "15",
        title: "Indemnification",
        content: (
            <>
                <p className="legal_p">
                    You agree to defend, indemnify, and hold harmless EventNest and its affiliates, officers, employees, contractors, and partners from any claims, liabilities, damages, losses, costs, or expenses arising from:
                </p>
                <ul className="legal_ul">
                    <li>Your use of the Services.</li>
                    <li>Your violation of these Terms.</li>
                    <li>Your bookings or payment activity.</li>
                    <li>Your violation of applicable laws or any event or venue rules.</li>
                    <li>Your infringement of third-party rights.</li>
                </ul>
            </>
        ),
    },
    {
        id: "termination",
        icon: "16",
        title: "Suspension and Termination",
        content: (
            <>
                <p className="legal_p">
                    We reserve the right to suspend, restrict, or terminate access to the Services at any time, with or without notice, if:
                </p>
                <ul className="legal_ul">
                    <li>You violate these Terms.</li>
                    <li>Fraudulent, abusive, or scalping activity is detected.</li>
                    <li>Your activities create legal, security, or operational risks.</li>
                    <li>Payment obligations are not fulfilled or chargebacks are abused.</li>
                    <li>We are required to do so by law.</li>
                </ul>
                <p className="legal_p">
                    Termination does not affect rights or obligations that accrued before termination, including completed bookings.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        icon: "17",
        title: "Changes to the Services and Terms",
        content: (
            <>
                <p className="legal_p">
                    We may modify the Services and these Terms from time to time.
                </p>
                <p className="legal_p">
                    Updated Terms will be posted on this page with a revised Effective Date.
                </p>
                <p className="legal_p">
                    Continued use of the Services after updated Terms become effective constitutes acceptance of the revised Terms.
                </p>
            </>
        ),
    },
    {
        id: "governing",
        icon: "18",
        title: "Governing Law and Jurisdiction",
        content: (
            <>
                <p className="legal_p">
                    These Terms shall be governed by and interpreted in accordance with the laws of India, without regard to conflict of law principles.
                </p>
                <p className="legal_p">
                    Any dispute arising out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the competent courts located in India.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        icon: "19",
        title: "Contact Information",
        content: (
            <div className="legal_contact_box">
                <p>If you have questions regarding these Terms, bookings, refunds, or support requests, please contact:</p>
                <p><strong>EventNest</strong></p>
                <p>Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
            </div>
        ),
    },
];

const TermsAndConditions = () => {
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
                    <h1 className="legal_hero__h1">Terms of Service</h1>
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

export default TermsAndConditions;
