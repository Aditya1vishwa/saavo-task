import { Link } from "react-router";
import "../../styles/legal.css";

const SUPPORT_EMAIL = "support@EventNestai.com";

const TOC = [
    { id: "introduction", label: "Introduction" },
    { id: "data-collected", label: "Information We Collect" },
    { id: "how-we-use", label: "How We Use Your Information" },
    { id: "ai-processing", label: "AI Processing and Automated Analysis" },
    { id: "recording-consent", label: "Recording and Processing Consent" },
    { id: "legal-basis", label: "Legal Basis for Processing" },
    { id: "cookies", label: "Cookies and Similar Technologies" },
    { id: "sharing", label: "Sharing of Information" },
    { id: "international", label: "International Data Transfers" },
    { id: "retention", label: "Data Retention" },
    { id: "security", label: "Data Security" },
    { id: "your-rights", label: "Your Rights and Choices" },
    { id: "california", label: "California Privacy Rights" },
    { id: "india", label: "India Data Protection Rights" },
    { id: "children", label: "Children's Privacy" },
    { id: "third-parties", label: "Third-Party Services and Links" },
    { id: "changes", label: "Changes to This Privacy Policy" },
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
                    Welcome to EventNestAI (&ldquo;EventNestAI,&rdquo; &ldquo;EventNest,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
                </p>
                <p className="legal_p">
                    EventNestAI is an AI-powered interview preparation and career development platform designed to help job seekers improve their interview performance, strengthen their resumes, enhance communication skills, identify areas for improvement, and prepare more effectively for employment opportunities.
                </p>
                <p className="legal_p">
                    We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, how we protect it, and the choices and rights available to you regarding your personal information.
                </p>
                <p className="legal_p">
                    By accessing or using EventNestAI&rsquo;s website, applications, or services (collectively, the &ldquo;Services&rdquo;), you acknowledge that you have read and understood this Privacy Policy.
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
                    To provide our Services, we collect information that you voluntarily provide, information generated through your use of the platform, and certain information collected automatically through your device and browser.
                </p>

                <p className="legal_p"><strong>Information You Provide</strong></p>
                <p className="legal_p">
                    When creating an account, subscribing to our Services, participating in interview practice sessions, or contacting us, you may provide personal information such as your name, email address, phone number, professional background, educational qualifications, employment history, career preferences, and other profile-related details.
                </p>
                <p className="legal_p">
                    You may also upload documents such as resumes, CVs, cover letters, portfolios, job descriptions, certificates, or other career-related materials. These documents may contain personal information that you choose to provide, including employment records, educational information, references, and contact details.
                </p>

                <p className="legal_p"><strong>Interview Practice and Communication Data</strong></p>
                <p className="legal_p">
                    EventNestAI allows users to participate in AI-powered interview simulations and communication training sessions. As part of these Services, we may collect and process interview responses, written answers, voice recordings, video recordings, communication metrics, assessment results, and AI-generated performance reports.
                </p>
                <p className="legal_p">
                    This information helps us evaluate interview performance, identify improvement opportunities, generate coaching recommendations, and deliver personalized feedback.
                </p>

                <p className="legal_p"><strong>AI Interaction Data</strong></p>
                <p className="legal_p">
                    When interacting with our AI-powered features, we may collect prompts, questions, instructions, chat messages, generated responses, session transcripts, and feedback provided by users. This information is used to deliver requested services, improve system performance, troubleshoot issues, and enhance the quality of our AI-powered features.
                </p>

                <p className="legal_p"><strong>Payment Information</strong></p>
                <p className="legal_p">
                    If you purchase a subscription or paid feature, payment transactions are processed through secure third-party payment processors. We do not store complete credit card numbers, banking credentials, CVV codes, or other sensitive payment authentication data on our systems. We may receive limited transaction-related information necessary for billing, payment verification, and account management purposes.
                </p>

                <p className="legal_p"><strong>Automatically Collected Information</strong></p>
                <p className="legal_p">
                    When you access or use our Services, we may automatically collect certain technical information, including your IP address, device type, browser type, operating system, language preferences, referral URLs, session activity, usage patterns, diagnostic information, crash reports, and interaction data.
                </p>
                <p className="legal_p">
                    This information helps us maintain platform security, improve performance, understand user behavior, and enhance the overall user experience.
                </p>
            </>
        ),
    },
    {
        id: "how-we-use",
        icon: "3",
        title: "How We Use Your Information",
        content: (
            <>
                <p className="legal_p">
                    We use the information we collect for legitimate business and operational purposes related to providing and improving our Services.
                </p>
                <p className="legal_p">
                    Specifically, we may use your information to create and manage your account, authenticate users, provide interview preparation tools, generate AI-powered feedback, analyze interview performance, improve communication coaching, deliver resume enhancement services, process payments, provide customer support, and communicate important service-related updates.
                </p>
                <p className="legal_p">
                    We also use information to maintain platform security, detect fraudulent activity, prevent misuse, comply with legal obligations, enforce our Terms of Service, conduct internal research, improve our artificial intelligence models, and develop new features and functionality.
                </p>
                <p className="legal_p">
                    Where permitted by applicable law, we may use aggregated and anonymized data for analytics, product development, reporting, benchmarking, and business intelligence purposes. Such information does not identify individual users.
                </p>
            </>
        ),
    },
    {
        id: "ai-processing",
        icon: "4",
        title: "AI Processing and Automated Analysis",
        content: (
            <>
                <p className="legal_p">
                    EventNestAI uses artificial intelligence, machine learning technologies, and automated systems to provide interview coaching, communication assessments, resume feedback, skill analysis, and personalized recommendations.
                </p>
                <p className="legal_p">
                    When using these Services, your interview responses, uploaded content, communication patterns, and interaction data may be analyzed by AI systems. These systems may evaluate factors such as response quality, communication clarity, confidence indicators, language proficiency, structure, relevance, and other performance-related characteristics.
                </p>
                <p className="legal_p">
                    The purpose of this analysis is to provide educational insights, performance feedback, coaching recommendations, and interview preparation assistance.
                </p>
                <div className="legal_highlight">
                    While we strive to provide accurate and helpful feedback, AI-generated outputs may occasionally contain inaccuracies, incomplete information, or subjective interpretations. Users should independently evaluate recommendations before making career, employment, or professional decisions.
                </div>
                <p className="legal_p">
                    EventNestAI does not guarantee job placement, interview success, employment offers, or any specific career outcome.
                </p>
            </>
        ),
    },
    {
        id: "recording-consent",
        icon: "5",
        title: "Recording and Processing Consent",
        content: (
            <>
                <p className="legal_p">
                    Certain features of EventNestAI may involve recording audio, video, or interview practice sessions. By using these features, you expressly consent to the collection, recording, storage, analysis, and processing of such content for the purpose of delivering Services, generating performance feedback, improving user experiences, maintaining security, and enhancing our technology.
                </p>
                <p className="legal_p">
                    You remain responsible for ensuring that any information or content you upload is lawful and that you possess all necessary rights, permissions, and authorizations to provide such content to the platform.
                </p>
            </>
        ),
    },
    {
        id: "legal-basis",
        icon: "6",
        title: "Legal Basis for Processing Personal Information",
        content: (
            <>
                <p className="legal_p">
                    Where required under applicable data protection laws, including the General Data Protection Regulation (GDPR), we process personal information based on one or more lawful grounds.
                </p>
                <p className="legal_p">
                    These grounds may include the necessity of processing to perform a contract with you, your consent, compliance with legal obligations, protection of legitimate business interests, fraud prevention, platform security, and the protection of users and the public.
                </p>
                <p className="legal_p">
                    Where processing is based on consent, you may withdraw your consent at any time, although doing so may affect your ability to use certain Services.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        icon: "7",
        title: "Cookies and Similar Technologies",
        content: (
            <>
                <p className="legal_p">
                    EventNestAI uses cookies, local storage, analytics technologies, and similar tracking mechanisms to provide functionality, maintain secure sessions, remember user preferences, measure performance, understand usage behavior, and improve the Services.
                </p>
                <p className="legal_p">
                    Cookies help us recognize returning users, maintain account authentication, analyze traffic patterns, and optimize the platform experience.
                </p>
                <p className="legal_p">
                    Most web browsers allow users to control or disable cookies through browser settings. However, disabling certain cookies may affect the functionality and availability of specific features within the Services.
                </p>
            </>
        ),
    },
    {
        id: "sharing",
        icon: "8",
        title: "Sharing of Information",
        content: (
            <>
                <p className="legal_p">We do not sell personal information to third parties.</p>
                <p className="legal_p">
                    We may share information with trusted service providers, contractors, vendors, and business partners who assist us in operating the platform, processing payments, providing cloud hosting, delivering communications, performing analytics, maintaining security, and supporting our business operations.
                </p>
                <p className="legal_p">
                    These third parties are authorized to access information only as necessary to perform services on our behalf and are contractually obligated to protect the confidentiality and security of such information.
                </p>
                <p className="legal_p">
                    We may also disclose information when required by law, court order, governmental request, regulatory obligation, legal process, or where disclosure is necessary to protect our legal rights, prevent fraud, investigate security incidents, or protect users and the public.
                </p>
                <p className="legal_p">
                    In connection with a merger, acquisition, financing, corporate restructuring, bankruptcy, or sale of assets, personal information may be transferred as part of the transaction, subject to applicable legal requirements.
                </p>
            </>
        ),
    },
    {
        id: "international",
        icon: "9",
        title: "International Data Transfers",
        content: (
            <>
                <p className="legal_p">
                    EventNestAI may use service providers, cloud infrastructure providers, and technology partners located in different countries. As a result, your information may be transferred to, stored in, or processed in jurisdictions outside your country of residence.
                </p>
                <p className="legal_p">
                    When such transfers occur, we take reasonable steps to ensure that appropriate safeguards are implemented to protect personal information in accordance with applicable data protection laws.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        icon: "10",
        title: "Data Retention",
        content: (
            <>
                <p className="legal_p">
                    We retain personal information only for as long as necessary to provide the Services, maintain user accounts, comply with legal obligations, resolve disputes, enforce agreements, improve platform functionality, and protect the security of our systems.
                </p>
                <p className="legal_p">
                    The exact retention period may vary depending on the nature of the information, the purpose for which it was collected, contractual obligations, and legal requirements.
                </p>
                <p className="legal_p">
                    When information is no longer required, we may delete, anonymize, or securely archive it in accordance with our data retention practices.
                </p>
            </>
        ),
    },
    {
        id: "security",
        icon: "11",
        title: "Data Security",
        content: (
            <>
                <p className="legal_p">
                    Protecting user information is a priority for us. We implement commercially reasonable administrative, technical, and organizational measures designed to safeguard personal information against unauthorized access, disclosure, alteration, misuse, or destruction.
                </p>
                <p className="legal_p">
                    These safeguards may include encryption, access controls, authentication mechanisms, monitoring systems, infrastructure security practices, secure cloud environments, and employee access restrictions.
                </p>
                <p className="legal_p">
                    Despite these efforts, no system, network, or method of electronic transmission can be guaranteed to be completely secure. Users should also take reasonable precautions to protect their account credentials and devices.
                </p>
            </>
        ),
    },
    {
        id: "your-rights",
        icon: "12",
        title: "Your Rights and Choices",
        content: (
            <>
                <p className="legal_p">
                    Depending on your location and applicable laws, you may have certain rights regarding your personal information.
                </p>
                <p className="legal_p">
                    These rights may include the right to access your information, request correction of inaccurate information, request deletion of personal information, restrict certain processing activities, object to processing, withdraw consent, and request a copy of your information in a portable format.
                </p>
                <p className="legal_p">
                    If you wish to exercise any of these rights, you may contact us at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>{SUPPORT_EMAIL}</a> using the contact information provided below. We may request verification of identity before processing certain requests.
                </p>
            </>
        ),
    },
    {
        id: "california",
        icon: "13",
        title: "California Privacy Rights",
        content: (
            <>
                <p className="legal_p">
                    If you are a California resident, you may have additional rights under applicable California privacy laws, including the right to know what personal information is collected, how it is used, and with whom it is shared. You may also have rights to request deletion or correction of certain information.
                </p>
                <p className="legal_p">
                    EventNestAI does not sell personal information or share personal information for cross-context behavioral advertising purposes.
                </p>
            </>
        ),
    },
    {
        id: "india",
        icon: "14",
        title: "India Data Protection Rights",
        content: (
            <>
                <p className="legal_p">
                    For users located in India, EventNestAI processes personal information in accordance with applicable provisions of the Digital Personal Data Protection Act, 2023 and other relevant laws.
                </p>
                <p className="legal_p">
                    Users may request access to their personal information, correction of inaccurate information, withdrawal of consent where applicable, and deletion of personal information subject to legal and operational requirements.
                </p>
            </>
        ),
    },
    {
        id: "children",
        icon: "15",
        title: "Children's Privacy",
        content: (
            <>
                <p className="legal_p">
                    EventNestAI is intended for individuals who are legally permitted to use our Services under applicable laws.
                </p>
                <p className="legal_p">
                    We do not knowingly collect personal information from children where parental consent is required by law. If we become aware that such information has been collected without appropriate authorization, we will take reasonable steps to remove it.
                </p>
            </>
        ),
    },
    {
        id: "third-parties",
        icon: "16",
        title: "Third-Party Services and Links",
        content: (
            <>
                <p className="legal_p">
                    Our Services may contain links to third-party websites, integrations, or services that are not operated or controlled by EventNestAI.
                </p>
                <p className="legal_p">
                    We are not responsible for the privacy practices, security measures, content, or policies of third-party platforms. Users are encouraged to review the privacy policies of any third-party services they access.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        icon: "17",
        title: "Changes to This Privacy Policy",
        content: (
            <>
                <p className="legal_p">
                    We may update this Privacy Policy from time to time to reflect changes in our Services, legal requirements, technology, or business practices.
                </p>
                <p className="legal_p">
                    When material changes are made, we will update the Effective Date shown at the top of this Privacy Policy and may provide additional notice where required by law.
                </p>
                <p className="legal_p">
                    Your continued use of the Services after any updates become effective constitutes acceptance of the revised Privacy Policy.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        icon: "18",
        title: "Contact Us",
        content: (
            <div className="legal_contact_box">
                <p>If you have any questions, requests, concerns, or complaints regarding this Privacy Policy or our data handling practices, please contact us at:</p>
                <p><strong>EventNestAI</strong></p>
                <p>Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
                <p>If you wish to request access, correction, export, or deletion of your personal information, please contact us using the email address above and include sufficient information for us to process your request.</p>
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

export default PrivacyPolicy;
