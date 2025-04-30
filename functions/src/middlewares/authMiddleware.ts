import {Request, Response, NextFunction} from "express";
import {auth} from "../config/firebase";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => { // Updated return type
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({message: "Unauthorized"});
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.body.userId = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(403).json({message: "Invalid token"});
  }
};
