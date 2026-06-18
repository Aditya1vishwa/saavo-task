import NotificationModel from "../db/mongodb/models/notification.model.js";

const createNotification = async ({
    userId,
    title,
    message,
    key = "general",
    data = {},
}) => {
    if (!userId || !title || !message) return null;

    return NotificationModel.create({
        userId,
        title,
        message,
        key,
        data,
    });
};

const notificationHelper = {
    createNotification,
};

export default notificationHelper;
