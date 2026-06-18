import { Link } from "react-router";
import "../../styles/legal.css";

const SUPPORT_EMAIL = "support@EventNestai.com";

const TOC = [
    { id: "introduction", label: "Introduction" },
    { id: "eligibility", label: "Eligibility" },
    { id: "description", label: "Description of Services" },
    { id: "accounts", label: "User Accounts" },
    { id: "conduct", label: "Acceptable Use" },
    { id: "user-content", label: "User Content" },
    { id: "ai-consent", label: "AI Processing & Recording Consent" },
    { id: "ai-disclaimer", label: "AI Disclaimer" },
    { id: "no-guarantee", label: "No Employment Guarantee" },
    { id: "recruiter", label: "Recruiter & Organization Responsibilities" },
    { id: "payments", label: "Subscription, Billing & Payments" },
    { id: "refunds", label: "Refund Policy" },
    { id: "ip", label: "Intellectual Property" },
    { id: "privacy", label: "Privacy" },
    { id: "warranties", label: "Disclaimer of Warranties" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "indemnification", label: "Indemnification" },
    { id: "termination", label: "Suspension and Termination" },
    { id: "force-majeure", label: "Force Majeure" },
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
                    Welcome to EventNestAI (&ldquo;EventNestAI,&rdquo; &ldquo;EventNest,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
                </p>
                <p className="legal_p">
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of EventNestAI&rsquo;s website, applications, software, content, and related services (collectively, the &ldquo;Services&rdquo;).
                </p>
                <p className="legal_p">
                    By creating an account, accessing, or using the Services, you agree to be legally bound by these Terms. If you do not agree with any part of these Terms, you must not access or use the Services.
                </p>
                <p className="legal_p">
                    These Terms constitute a legally binding agreement between you and EventNestAI.
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
                    To use the Services, you must be legally capable of entering into a binding agreement under applicable law.
                </p>
                <p className="legal_p">By using the Services, you represent and warrant that:</p>
                <ul className="legal_ul">
                    <li>You are at least the minimum age required under applicable law.</li>
                    <li>You have the legal authority to enter into these Terms.</li>
                    <li>All information you provide is accurate, current, and complete.</li>
                    <li>You will comply with all applicable laws, regulations, and industry requirements while using the Services.</li>
                </ul>
                <p className="legal_p">
                    If you are using the Services on behalf of an organization, company, or employer, you represent that you have authority to bind that entity to these Terms.
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
                    EventNestAI provides AI-powered interview preparation and career development tools, including but not limited to:
                </p>
                <ul className="legal_ul">
                    <li>AI interview simulations</li>
                    <li>Voice-based interview practice</li>
                    <li>Communication and speaking assessments</li>
                    <li>Resume analysis and improvement</li>
                    <li>Career coaching assistance</li>
                    <li>Interview performance feedback</li>
                    <li>AI-generated reports and recommendations</li>
                    <li>Skill development tools</li>
                    <li>Job readiness assessments</li>
                    <li>Related educational and productivity features</li>
                </ul>
                <p className="legal_p">
                    We may modify, improve, suspend, replace, or discontinue any feature or functionality at any time without liability.
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
                    You may be required to create an account to access certain Services.
                </p>
                <p className="legal_p">
                    You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                </p>
                <p className="legal_p">
                    You agree to notify us immediately at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>{SUPPORT_EMAIL}</a> if you become aware of any unauthorized access, misuse, or security breach involving your account.
                </p>
                <p className="legal_p">
                    EventNestAI is not responsible for losses arising from unauthorized use of your account caused by your failure to safeguard account credentials.
                </p>
            </>
        ),
    },
    {
        id: "conduct",
        icon: "5",
        title: "Acceptable Use",
        content: (
            <>
                <p className="legal_p">You agree to use the Services only for lawful purposes.</p>
                <p className="legal_p">You must not:</p>
                <ul className="legal_ul">
                    <li>Violate any applicable law or regulation.</li>
                    <li>Use the Services for fraudulent, deceptive, or misleading activities.</li>
                    <li>Attempt to gain unauthorized access to systems, accounts, or data.</li>
                    <li>Interfere with platform functionality or security.</li>
                    <li>Upload malicious software, malware, viruses, or harmful code.</li>
                    <li>Reverse engineer, copy, decompile, scrape, or attempt to extract source code or proprietary technology.</li>
                    <li>Use automated tools to access the platform in an unauthorized manner.</li>
                    <li>Upload content that is unlawful, defamatory, abusive, discriminatory, harmful, or infringes third-party rights.</li>
                    <li>Circumvent platform limitations, security controls, or subscription restrictions.</li>
                </ul>
                <p className="legal_p">
                    Violation of these Terms may result in suspension, termination, legal action, or all of the foregoing.
                </p>
            </>
        ),
    },
    {
        id: "user-content",
        icon: "6",
        title: "User Content",
        content: (
            <>
                <p className="legal_p">
                    You retain ownership of the content you upload to the Services, including resumes, interview responses, documents, recordings, and other materials (&ldquo;User Content&rdquo;).
                </p>
                <p className="legal_p">
                    By uploading or submitting User Content, you grant EventNestAI a worldwide, non-exclusive, royalty-free license to host, store, process, analyze, reproduce, and use such content solely for the purpose of providing, maintaining, securing, improving, and operating the Services.
                </p>
                <p className="legal_p">You represent and warrant that:</p>
                <ul className="legal_ul">
                    <li>You own or have all necessary rights to upload the content.</li>
                    <li>The content does not violate any law or third-party rights.</li>
                    <li>The content does not contain unlawful, malicious, or infringing material.</li>
                </ul>
            </>
        ),
    },
    {
        id: "ai-consent",
        icon: "7",
        title: "AI Processing, Analysis, and Recording Consent",
        content: (
            <>
                <p className="legal_p">
                    EventNestAI uses artificial intelligence, machine learning technologies, and automated systems to provide interview coaching, communication analysis, resume feedback, assessments, and recommendations.
                </p>
                <p className="legal_p">By using the Services, you expressly acknowledge and agree that:</p>
                <ul className="legal_ul">
                    <li>Interview practice sessions may be recorded.</li>
                    <li>Audio, video, text, and communication data may be collected and processed.</li>
                    <li>Interviews conducted through EventNestAI may be recorded, analyzed, and processed using artificial intelligence technologies for evaluation, reporting, quality assurance, security, fraud prevention, research, and platform improvement purposes.</li>
                    <li>AI systems may evaluate communication style, speaking patterns, response quality, confidence indicators, and other performance-related factors.</li>
                    <li>AI-generated outputs are intended for informational, educational, and coaching purposes only.</li>
                </ul>
                <p className="legal_p">
                    You consent to such processing as necessary for the operation of the Services.
                </p>
            </>
        ),
    },
    {
        id: "ai-disclaimer",
        icon: "8",
        title: "AI Disclaimer",
        content: (
            <>
                <p className="legal_p">
                    EventNestAI provides AI-generated suggestions, evaluations, recommendations, scores, insights, and feedback.
                </p>
                <p className="legal_p">You acknowledge and agree that:</p>
                <ul className="legal_ul">
                    <li>AI-generated content may contain inaccuracies, errors, omissions, or outdated information.</li>
                    <li>AI-generated recommendations should not be considered professional, legal, employment, financial, or career advice.</li>
                    <li>Results may vary between users and sessions.</li>
                    <li>EventNestAI does not guarantee the accuracy, completeness, reliability, or suitability of AI-generated outputs.</li>
                </ul>
                <p className="legal_p">
                    Users are solely responsible for evaluating and relying upon any recommendations provided by the platform.
                </p>
            </>
        ),
    },
    {
        id: "no-guarantee",
        icon: "9",
        title: "No Employment Guarantee",
        content: (
            <>
                <p className="legal_p">EventNestAI is a preparation and educational platform.</p>
                <p className="legal_p">We do not guarantee:</p>
                <ul className="legal_ul">
                    <li>Job interviews</li>
                    <li>Job offers</li>
                    <li>Employment opportunities</li>
                    <li>Candidate selection</li>
                    <li>Career advancement</li>
                    <li>Hiring outcomes</li>
                </ul>
                <p className="legal_p">
                    Success in interviews and employment decisions depends on numerous factors outside our control.
                </p>
            </>
        ),
    },
    {
        id: "recruiter",
        icon: "10",
        title: "Recruiter and Organization Responsibilities",
        content: (
            <>
                <p className="legal_p">
                    Organizations, recruiters, and hiring teams remain solely responsible for:
                </p>
                <ul className="legal_ul">
                    <li>Candidate evaluations</li>
                    <li>Hiring decisions</li>
                    <li>Employment decisions</li>
                    <li>Interview configuration</li>
                    <li>Candidate communication</li>
                    <li>Compliance with labor laws</li>
                    <li>Compliance with privacy and data protection laws</li>
                    <li>Obtaining legally required candidate consent</li>
                </ul>
                <p className="legal_p">
                    EventNestAI does not participate in employment decisions and is not responsible for hiring outcomes.
                </p>
            </>
        ),
    },
    {
        id: "payments",
        icon: "11",
        title: "Subscription Plans, Billing, and Payments",
        content: (
            <>
                <p className="legal_p">
                    Certain features may require payment of subscription fees or one-time charges.
                </p>
                <p className="legal_p">
                    By purchasing a subscription, you authorize us and our payment processors to charge applicable fees using your selected payment method.
                </p>
                <p className="legal_p">Unless otherwise stated:</p>
                <ul className="legal_ul">
                    <li>Subscription plans automatically renew at the end of each billing cycle.</li>
                    <li>Renewal charges will be billed using the payment method on file.</li>
                    <li>You may cancel renewal at any time before the next billing period begins.</li>
                    <li>Pricing may be updated at our discretion with reasonable notice where required by law.</li>
                </ul>
                <p className="legal_p">
                    Failure to pay fees may result in suspension or termination of access to paid Services.
                </p>
            </>
        ),
    },
    {
        id: "refunds",
        icon: "12",
        title: "Refund Policy",
        content: (
            <>
                <p className="legal_p">
                    Except where required by applicable law, all payments are non-refundable.
                </p>
                <p className="legal_p">
                    If a refund policy is offered for a specific plan, product, promotion, or jurisdiction, eligibility requirements must be satisfied before a refund is approved.
                </p>
                <p className="legal_p">
                    Refund requests for eligible purchases must generally be submitted within seven (7) days of purchase and may be denied where Services have already been substantially used or consumed.
                </p>
            </>
        ),
    },
    {
        id: "ip",
        icon: "13",
        title: "Intellectual Property",
        content: (
            <>
                <p className="legal_p">
                    All rights, title, and interest in and to the Services, including software, technology, algorithms, designs, trademarks, logos, branding, content, interfaces, documentation, and intellectual property rights, are owned by or licensed to EventNestAI.
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
        id: "privacy",
        icon: "14",
        title: "Privacy",
        content: (
            <>
                <p className="legal_p">
                    Your use of the Services is also governed by our <Link to="/privacy" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>, which describes how we collect, process, store, and protect personal information.
                </p>
                <p className="legal_p">
                    By using the Services, you acknowledge and agree to the practices described in the Privacy Policy.
                </p>
            </>
        ),
    },
    {
        id: "warranties",
        icon: "15",
        title: "Disclaimer of Warranties",
        content: (
            <>
                <div className="legal_highlight">
                    The Services are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis.
                </div>
                <p className="legal_p">
                    To the maximum extent permitted by law, EventNestAI disclaims all warranties, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, reliability, and uninterrupted operation.
                </p>
                <p className="legal_p">
                    We do not guarantee that the Services will be error-free, uninterrupted, secure, or suitable for your specific needs.
                </p>
            </>
        ),
    },
    {
        id: "liability",
        icon: "16",
        title: "Limitation of Liability",
        content: (
            <>
                <p className="legal_p">
                    To the fullest extent permitted by law, EventNestAI, its affiliates, directors, employees, partners, and licensors shall not be liable for:
                </p>
                <ul className="legal_ul">
                    <li>Employment or hiring outcomes</li>
                    <li>Loss of revenue</li>
                    <li>Loss of profits</li>
                    <li>Loss of business opportunities</li>
                    <li>Data loss</li>
                    <li>Service interruptions</li>
                    <li>AI-generated inaccuracies</li>
                    <li>Reputational harm</li>
                    <li>Indirect, incidental, special, consequential, or punitive damages</li>
                </ul>
                <p className="legal_p">
                    Our total cumulative liability arising from or related to the Services shall not exceed the amount paid by you to EventNestAI during the twelve (12) months preceding the event giving rise to the claim.
                </p>
            </>
        ),
    },
    {
        id: "indemnification",
        icon: "17",
        title: "Indemnification",
        content: (
            <>
                <p className="legal_p">
                    You agree to defend, indemnify, and hold harmless EventNestAI and its affiliates, officers, employees, contractors, and partners from any claims, liabilities, damages, losses, costs, or expenses arising from:
                </p>
                <ul className="legal_ul">
                    <li>Your use of the Services.</li>
                    <li>Your violation of these Terms.</li>
                    <li>Your uploaded content.</li>
                    <li>Your violation of applicable laws.</li>
                    <li>Your infringement of third-party rights.</li>
                </ul>
            </>
        ),
    },
    {
        id: "termination",
        icon: "18",
        title: "Suspension and Termination",
        content: (
            <>
                <p className="legal_p">
                    We reserve the right to suspend, restrict, or terminate access to the Services at any time, with or without notice, if:
                </p>
                <ul className="legal_ul">
                    <li>You violate these Terms.</li>
                    <li>Your activities create legal, security, or operational risks.</li>
                    <li>Fraudulent or abusive conduct is detected.</li>
                    <li>Payment obligations are not fulfilled.</li>
                    <li>We are required to do so by law.</li>
                </ul>
                <p className="legal_p">
                    Termination does not affect rights or obligations that accrued before termination.
                </p>
            </>
        ),
    },
    {
        id: "force-majeure",
        icon: "19",
        title: "Force Majeure",
        content: (
            <p className="legal_p">
                EventNestAI shall not be liable for any delay or failure in performance resulting from events beyond our reasonable control, including natural disasters, internet failures, cyberattacks, governmental actions, labor disputes, power outages, or failures of third-party service providers.
            </p>
        ),
    },
    {
        id: "changes",
        icon: "20",
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
        icon: "21",
        title: "Governing Law and Jurisdiction",
        content: (
            <>
                <p className="legal_p">
                    These Terms shall be governed by and interpreted in accordance with the laws of India, without regard to conflict of law principles.
                </p>
                <p className="legal_p">
                    Any dispute arising out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        icon: "22",
        title: "Contact Information",
        content: (
            <div className="legal_contact_box">
                <p>If you have questions regarding these Terms, legal notices, privacy matters, or support requests, please contact:</p>
                <p><strong>EventNestAI</strong></p>
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
                    <p className="legal_hero__meta">Effective date: April 12, 2026 &nbsp;·&nbsp; Last updated: April 12, 2026</p>
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
