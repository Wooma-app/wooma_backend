import express from "express";
import {verifyOtpHandler, onUserSignupHandler} from "../controllers/authController";

const router = express.Router();

router.post("/verify-otp", verifyOtpHandler);
router.post("/signup", onUserSignupHandler);

export default router;
