import express from "express";
import {verifyOtpHandler, onUserSignupHandler, onUserSigninHandler} from "../controllers/authController";

const router = express.Router();

router.post("/verify-otp", verifyOtpHandler);
router.post("/signup", onUserSignupHandler);
router.post("/signin", onUserSigninHandler);

export default router;
