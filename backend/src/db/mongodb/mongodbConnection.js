import mongoose from "mongoose";
import UserModel from "./models/user.model.js";
import authHelpers from "../../helpers/Auth.js";

// Auto-create demo accounts (admin + organizer + attendee) on startup so the app
// is immediately usable in dev/demo. Controlled by env:
//   CREATE_DEMO_USERS   ("true" to enable — otherwise skipped)
//   DEMO_PASS           (login password for all demo accounts; required)
//   DEMO_ADMIN_EMAIL    (default: admin@eventnest.app)
//   DEMO_ORGANIZER_EMAIL(default: organizer@eventnest.app)
//   DEMO_USER_EMAIL     (default: user@eventnest.app)
// Existing accounts are never overwritten.
const seedDemoUsers = async () => {
    if (process.env.CREATE_DEMO_USERS !== "true") {
        console.info("[Seed] CREATE_DEMO_USERS is not 'true' — skipping demo user seeding.");
        return;
    }

    const password = process.env.DEMO_PASS;
    if (!password) {
        console.info("[Seed] CREATE_DEMO_USERS is enabled but DEMO_PASS is not set — skipping.");
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
            name: "Demo Organizer",
            email: (process.env.DEMO_ORGANIZER_EMAIL || "organizer@eventnest.app").toLowerCase(),
            role: "organizer",
            userType: "organizer",
        },
        {
            name: "Demo User",
            email: (process.env.DEMO_USER_EMAIL || "user@eventnest.app").toLowerCase(),
            role: "user",
            userType: "attendee",
        },
    ];

    console.info("\n──────────────── Demo accounts ────────────────");
    for (const demo of demos) {
        const exists = await UserModel.findOne({ email: demo.email }).select("_id");
        if (exists) {
            console.info(`  •  ${demo.role.padEnd(10)} ${demo.email}  (already exists)`);
            continue;
        }
        const hashedPassword = await authHelpers.hashPassword(password);
        await UserModel.create({
            ...demo,
            password: hashedPassword,
            isEmailVerified: true,
            status: "active",
        });
        console.info(`  ✓  ${demo.role.padEnd(10)} ${demo.email}  (password: ${password})`);
    }
    console.info("───────────────────────────────────────────────");
    console.info(`  Log in with any email above using password: ${password}`);
    console.info("───────────────────────────────────────────────\n");
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
