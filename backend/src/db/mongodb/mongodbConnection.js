import mongoose from "mongoose";
import UserModel from "./models/user.model.js";
import authHelpers from "../../helpers/Auth.js";

// Auto-create demo accounts (admin + attendee) on startup so the app is
// immediately usable in dev/demo. Controlled by env:
//   DEMO_PASS         (required — if unset, seeding is skipped)
//   DEMO_ADMIN_EMAIL  (default: admin@eventnest.app)
//   DEMO_USER_EMAIL   (default: user@eventnest.app)
// Existing accounts are never overwritten.
const seedDemoUsers = async () => {
    const password = process.env.DEMO_PASS;
    if (!password) {
        console.info("[Seed] DEMO_PASS not set — skipping demo user seeding.");
        return;
    }

    const demos = [
        {
            name: "Demo Admin",
            email: (process.env.DEMO_ADMIN_EMAIL || "admin@eventnest.app").toLowerCase(),
            role: "admin",
            userType: "admin",
        },
        {
            name: "Demo User",
            email: (process.env.DEMO_USER_EMAIL || "user@eventnest.app").toLowerCase(),
            role: "user",
            userType: "attendee",
        },
    ];

    for (const demo of demos) {
        const exists = await UserModel.findOne({ email: demo.email }).select("_id");
        if (exists) continue;
        const hashedPassword = await authHelpers.hashPassword(password);
        await UserModel.create({
            ...demo,
            password: hashedPassword,
            isEmailVerified: true,
            status: "active",
        });
        console.info(`[Seed] Created demo ${demo.role}: ${demo.email}`);
    }
};

const mongodbConnection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        await seedDemoUsers();
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default mongodbConnection
