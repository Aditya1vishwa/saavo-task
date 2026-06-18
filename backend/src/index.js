import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Fix DNS resolution issue for MongoDB SRV records
import dns from "node:dns/promises";
dns.setServers([
  "1.1.1.1",
  "1.0.0.1"
]);
import app from './app.js';
import { createServer } from "http";
import mongodbConnection from "./db/mongodb/mongodbConnection.js";


mongodbConnection().then(() => {
    const PORT = process.env.PORT || 5002;
    const server = createServer(app);

    server.listen(PORT, () => {
        console.log(`Server running at port: ${PORT}`);
    });
}).catch((err) => {
    console.error(" MongoDB connection failed:", err);
});
