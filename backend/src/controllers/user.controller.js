import HelpTicketModel from "../db/mongodb/models/helpticket.model.js";
import NotificationModel from "../db/mongodb/models/notification.model.js";

const toPositiveInt = (value, fallback = 10) => {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const createHelpTicket = async (req, res, next) => {
    try {
        const { subject, query } = req.body || {};

        if (!subject || !String(subject).trim() || !query || !String(query).trim()) {
            return res.status(400).json({ success: false, message: "Subject and query are required" });
        }

        const ticket = await HelpTicketModel.create({
            userId: req.user._id,
            subject: String(subject).trim(),
            query: String(query).trim(),
            status: "open",
        });

        return res.status(201).json({ success: true, data: { ticket }, message: "Query submitted successfully" });
    } catch (error) {
        next(error);
    }
};

const listHelpTickets = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = { userId: req.user._id };

        const [items, total] = await Promise.all([
            HelpTicketModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("answeredBy", "name email"),
            HelpTicketModel.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                items,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

const listNotifications = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const [items, total, unreadCount] = await Promise.all([
            NotificationModel.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            NotificationModel.countDocuments({ userId: req.user._id }),
            NotificationModel.countDocuments({ userId: req.user._id, status: "unread" }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                items,
                unreadCount,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

const markNotificationRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const item = await NotificationModel.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { $set: { status: "read" } },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        return res.status(200).json({ success: true, data: { item }, message: "Notification marked as read" });
    } catch (error) {
        next(error);
    }
};

const markAllNotificationsRead = async (req, res, next) => {
    try {
        await NotificationModel.updateMany({ userId: req.user._id, status: "unread" }, { $set: { status: "read" } });
        return res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        next(error);
    }
};

// Handlers grouped by HTTP method (see shared controller convention).
const userController = {
    post: {
        createHelpTicket,
    },
    get: {
        listHelpTickets,
        listNotifications,
    },
    patch: {
        markNotificationRead,
        markAllNotificationsRead,
    },
};

export default userController;
