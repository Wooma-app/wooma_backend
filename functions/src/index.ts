/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";
import reportRoutes from "./routes/reportRoutes";
import "./config/firebase";

const app = express();

app.use(cors());

app.use("/api/image", imageRoutes);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);

export const api = functions.https.onRequest(app);
