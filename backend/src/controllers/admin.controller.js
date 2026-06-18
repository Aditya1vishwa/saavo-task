import UserModel from "../db/mongodb/models/user.model.js";
import KeyValueModel from "../db/mongodb/models/keyvalue.model.js";
import HelpTicketModel from "../db/mongodb/models/helpticket.model.js";
import notificationHelper from "../helpers/notification.helper.js";

const toPositiveInt = (value, fallback = 10) => {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const parseKeyValueInput = ({ valueType, valueRaw }) => {
    if (valueType === "string") {
        if (typeof valueRaw !== "string") {
            throw new Error("For string type, value must be a string.");
        }
        return valueRaw;
    }

    let parsed;
    if (typeof valueRaw === "string") {
        try {
            parsed = JSON.parse(valueRaw);
        } catch {
            throw new Error("Value must be a valid JSON for object/array type.");
        }
    } else {
        parsed = valueRaw;
    }

    if (valueType === "object" && (!parsed || Array.isArray(parsed) || typeof parsed !== "object")) {
        throw new Error("For object type, value must be a valid object.");
    }

    if (valueType === "array" && !Array.isArray(parsed)) {
        throw new Error("For array type, value must be a valid array.");
    }

    return parsed;
};

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalOpenHelpTickets,
            latestUsers,
            latestHelpTickets,
        ] = await Promise.all([
            UserModel.countDocuments({ role: { $ne: "admin" }, status: { $ne: "deleted" } }),
            HelpTicketModel.countDocuments({ status: "open" }),
            UserModel.find({ role: { $ne: "admin" }, status: { $ne: "deleted" } })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name email status role userType createdAt"),
            HelpTicketModel.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("userId", "name email")
                .select("subject status createdAt userId"),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalOpenHelpTickets,
                latestUsers,
                latestHelpTickets,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;
        const search = String(req.query.search || "").trim();

        const query = {
            role: { $ne: "admin" },
            status: { $ne: "deleted" },
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const [users, total] = await Promise.all([
            UserModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("name email phone status role userType createdAt"),
            UserModel.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                users,
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

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body || {};

        const updatePayload = {};
        ["name", "email", "phone", "status"].forEach((field) => {
            if (payload[field] !== undefined) updatePayload[field] = payload[field];
        });

        // Role changes are restricted to attendee <-> organizer (never admin via this route).
        // Keep `role` and `userType` in sync so guards + UI agree.
        if (payload.role !== undefined || payload.userType !== undefined) {
            const desired = payload.role || payload.userType;
            if (desired === "organizer") {
                updatePayload.role = "organizer";
                updatePayload.userType = "organizer";
            } else if (desired === "user" || desired === "attendee") {
                updatePayload.role = "user";
                updatePayload.userType = "attendee";
            }
        }

        const user = await UserModel.findOneAndUpdate(
            { _id: id, role: { $ne: "admin" }, status: { $ne: "deleted" } },
            { $set: updatePayload },
            { new: true }
        ).select("name email phone status role userType createdAt");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, data: { user }, message: "User updated" });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findOneAndUpdate(
            { _id: id, role: { $ne: "admin" }, status: { $ne: "deleted" } },
            { $set: { status: "deleted" } },
            { new: true }
        ).select("_id");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        next(error);
    }
};

const getKeyValueTypes = async (_req, res, next) => {
    try {
        const types = await KeyValueModel.distinct("type");
        return res.status(200).json({ success: true, data: { types } });
    } catch (error) {
        next(error);
    }
};

const listKeyValues = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.type) query.type = req.query.type;
        if (req.query.search) {
            const search = String(req.query.search);
            query.$or = [{ key: { $regex: search, $options: "i" } }, { type: { $regex: search, $options: "i" } }];
        }

        const [items, total] = await Promise.all([
            KeyValueModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            KeyValueModel.countDocuments(query),
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

const createKeyValue = async (req, res, next) => {
    try {
        const { type, key, valueType, value } = req.body || {};

        if (!type || !key || !valueType) {
            return res.status(400).json({ success: false, message: "type, key, and valueType are required" });
        }

        const parsedValue = parseKeyValueInput({ valueType, valueRaw: value });

        const item = await KeyValueModel.create({
            type: String(type).trim(),
            key: String(key).trim(),
            valueType,
            value: parsedValue,
            createdBy: req.user._id,
            updatedBy: req.user._id,
        });

        return res.status(201).json({ success: true, data: { item }, message: "Key-value created" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Type + key already exists" });
        }
        if (error.message.includes("valid")) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const updateKeyValue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body || {};

        const updatePayload = { updatedBy: req.user._id };
        if (payload.type !== undefined) updatePayload.type = String(payload.type).trim();
        if (payload.key !== undefined) updatePayload.key = String(payload.key).trim();
        if (payload.status !== undefined) updatePayload.status = payload.status;
        if (payload.valueType !== undefined) updatePayload.valueType = payload.valueType;
        if (payload.value !== undefined || payload.valueType !== undefined) {
            const existing = await KeyValueModel.findById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Key-value not found" });
            }
            const effectiveType = payload.valueType || existing.valueType;
            const effectiveValue = payload.value !== undefined ? payload.value : existing.value;
            updatePayload.value = parseKeyValueInput({ valueType: effectiveType, valueRaw: effectiveValue });
        }

        const item = await KeyValueModel.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
        if (!item) {
            return res.status(404).json({ success: false, message: "Key-value not found" });
        }

        return res.status(200).json({ success: true, data: { item }, message: "Key-value updated" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Type + key already exists" });
        }
        if (error.message.includes("valid")) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const deleteKeyValue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await KeyValueModel.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Key-value not found" });
        }
        return res.status(200).json({ success: true, message: "Key-value deleted" });
    } catch (error) {
        next(error);
    }
};

const listHelpTickets = async (req, res, next) => {
    try {
        const page = toPositiveInt(req.query.page, 1);
        const limit = toPositiveInt(req.query.limit, 10);
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.status) query.status = req.query.status;

        const [items, total] = await Promise.all([
            HelpTicketModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "name email")
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

const answerHelpTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { answer } = req.body || {};

        if (!answer || !String(answer).trim()) {
            return res.status(400).json({ success: false, message: "Answer is required" });
        }

        const ticket = await HelpTicketModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    answer: String(answer).trim(),
                    status: "answered",
                    answeredBy: req.user._id,
                    answeredAt: new Date(),
                },
            },
            { new: true }
        ).populate("userId", "_id");

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        await notificationHelper.createNotification({
            userId: ticket.userId?._id,
            title: "Support response received",
            message: `Your query "${ticket.subject}" has been answered by admin.`,
            key: "help_ticket_answered",
            data: {
                ticketId: ticket._id,
                subject: ticket.subject,
                status: ticket.status,
            },
        });

        return res.status(200).json({ success: true, data: { ticket }, message: "Ticket answered" });
    } catch (error) {
        next(error);
    }
};

// Handlers grouped by HTTP method (see shared controller convention).
const adminController = {
    get: {
        getDashboardStats,
        getUsers,
        getKeyValueTypes,
        listKeyValues,
        listHelpTickets,
    },
    post: {
        createKeyValue,
        answerHelpTicket,
    },
    patch: {
        updateUser,
        updateKeyValue,
    },
    delete: {
        deleteUser,
        deleteKeyValue,
    },
};

export default adminController;
