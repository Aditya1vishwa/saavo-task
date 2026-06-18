import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, "email-templates");

const createTransporter = () => {
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;

    if (!user || !pass) return null;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
};


const renderTemplate = (templateName, data = {}) => {
    const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Email template not found: ${templateName}`);
    }
    let html = fs.readFileSync(filePath, "utf-8");
    for (const [key, value] of Object.entries(data)) {
        html = html.replaceAll(`{{${key}}}`, String(value ?? ""));
    }
    return html;
};


const sendMail = async ({ to, subject, templateName, data = {} }) => {
    try {
        const html = renderTemplate(templateName, data);
        const fromName = process.env.SMTP_FROM_NAME || "EventNest";
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@eventnest.app";

        const transporter = createTransporter();
        if (!transporter) {
            console.info("[EmailHelper] SMTP not configured — skipping email to:", to);
            return false;
        }

        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.info("[EmailHelper] (SMTP) Email sent to:", to, "| Subject:", subject);
        return true;
    } catch (error) {
        console.error("[EmailHelper] Failed to send email:", error.message);
        return false;
    }
};

const emailHelper = { sendMail, renderTemplate };
export default emailHelper;
