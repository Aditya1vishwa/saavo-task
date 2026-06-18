import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import expressWinston from "express-winston";
import winston from "winston";
import fs from "fs";
if (!fs.existsSync("logs")) fs.mkdirSync("logs");
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPublicDir = path.join(__dirname, "..", "public", "dist");
const publicDir = fs.existsSync(distPublicDir)
    ? distPublicDir
    : path.join(__dirname, "..", "public");
const publicIndexPath = path.join(publicDir, "index.html");
const STATIC_COMPRESSIBLE_EXTENSIONS = new Set([
    ".html",
    ".js",
    ".mjs",
    ".css",
    ".json",
    ".svg",
    ".txt",
    ".xml",
    ".wasm",
    ".map",
]);

const app = express()

// Security headers. CSP/CORP disabled because the same server also hosts the
// SPA (inline styles, external fonts, TinyMCE) and serves cross-origin uploads.
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

const allowedOrigins = [
    "http://localhost:5173",
    "http://52.5.38.251:8002",
    "https://EventNestai.com",
    "http://localhost:4173",
    "http://localhost:8002",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
    const acceptedEncoding = req.headers["accept-encoding"] || "";
    const supportsBrotli = /\bbr\b/.test(acceptedEncoding);
    const supportsGzip = /\bgzip\b/.test(acceptedEncoding);
    if (!supportsBrotli && !supportsGzip) return next();
    let requestPath;
    try {
        requestPath = decodeURIComponent(req.path);
    } catch {
        return next();
    }
    const normalizedPath = requestPath === "/"
        ? "index.html"
        : requestPath.replace(/^\/+/, "");
    const fileExt = path.extname(normalizedPath).toLowerCase();
    if (!STATIC_COMPRESSIBLE_EXTENSIONS.has(fileExt)) return next();

    const absolutePath = path.resolve(publicDir, normalizedPath);
    if (!absolutePath.startsWith(publicDir)) return next();

    const brotliPath = `${absolutePath}.br`;
    const gzipPath = `${absolutePath}.gz`;

    const setCompressionHeaders = (encoding) => {
        res.setHeader("Vary", "Accept-Encoding");
        res.setHeader("Content-Encoding", encoding);
        res.type(fileExt);
    };

    if (supportsBrotli && fs.existsSync(brotliPath)) {
        setCompressionHeaders("br");
        return res.sendFile(brotliPath);
    }

    if (supportsGzip && fs.existsSync(gzipPath)) {
        setCompressionHeaders("gzip");
        return res.sendFile(gzipPath);
    }

    return next();
});
app.use(express.static(publicDir, {
    maxAge: "7d",
    setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache");
            return;
        }

        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
    }
}))
app.use(
    "/uploads", express.static(path.join(__dirname, "..", "uploads"))
);


app.use(cookieParser())


app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: 'logs/api.log' })
    ],
    format: winston.format.json(),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
}));




import authRouter from "./routes/auth.route.js"
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import locationRouter from "./routes/location.route.js";
import venueRouter from "./routes/venue.route.js";
import eventRouter from "./routes/event.route.js";
import bookingRouter from "./routes/booking.route.js";
import ticketRouter from "./routes/ticket.route.js";

// Throttle auth endpoints (brute-force / signup-spam protection).
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts. Please try again later." },
});

/// V1 Routes ////
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/location", locationRouter);
app.use("/api/venues", venueRouter);
app.use("/api/events", eventRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/tickets", ticketRouter);


app.get(/^\/(?!api\/).*/, (req, res, next) => {
    if (req.path.startsWith("/uploads")) return next();
    if (!req.accepts("html")) return next();
    if (!fs.existsSync(publicIndexPath)) return next();
    res.sendFile(publicIndexPath);
});



app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app 

// Start background worker for resend retries (non-blocking)
// Background retry worker removed: retries are driven by user requests only.
