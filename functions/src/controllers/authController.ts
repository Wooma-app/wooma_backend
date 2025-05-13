import {Request, Response} from "express";
import {onUserSignin, onUserSignup} from "../services/authService";

export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const {otp, confirmationResult} = req.body;

    // Validate the OTP and confirmationResult
    if (!otp || !confirmationResult) {
      res.status(400).json({error: "OTP and confirmationResult are required."});
      return;
    }

    // Type assertion to ensure confirmationResult is of the correct type
    const confirmation = confirmationResult;

    // Confirm the OTP using the confirmationResult passed from the frontend
    const userCredential = await confirmation.confirm(otp);

    // If OTP is correct, return user data
    res.json({message: "OTP verified successfully.", user: userCredential.user});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const onUserSignupHandler = async (req: Request, res: Response) => {
  try {
    const {uid, phoneNumber} = req.body;
    await onUserSignup(uid, phoneNumber);
    res.json({message: "User created successfully"});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const onUserSigninHandler = async (req: Request, res: Response) => {
  try {
    const {uid} = req.body;
    await onUserSignin(uid);
    res.json({message: "User created successfully"});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
