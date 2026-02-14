import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
// import admin from "firebase-admin";
// import fs from "fs";
import path from "path";
import { ConnectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

// const serviceAccount = JSON.parse(
//     fs.readFileSync("./plus-curenearme-14fb7-firebase-adminsdk-cm6fi-52aa891d06.json", "utf8")
// );

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//     });
//     console.log("✅ Firebase Admin initialized");
// }

dotenv.config();


const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" }))
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser())



app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
// Health check endpoint for Docker and AWS

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Github actions are healthy', timestamp: new Date().toISOString() });
});






const PORT = process.env.PORT || 3000;

// if (process.env.NODE_ENV == "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")))
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//     })
// }



server.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
    ConnectDB();
})