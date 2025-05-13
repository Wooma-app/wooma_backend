/* eslint-disable linebreak-style */
import {auth, db} from "../config/firebase";

export const verifyOtp = async (phoneNumber: string) => {
  const user = await auth.getUserByPhoneNumber(phoneNumber);
  console.log("User exists:", user);
  if (user) {
    return {user, otpCode: auth.verifyIdToken(user.uid)};
  }

  const newUser = await auth.createUser({phoneNumber});
  return {user: newUser, otpCode: auth.verifyIdToken(newUser.uid)};
};

export const onUserSignup = async (uid: string, phoneNumber: string) => {
  const userRef = db.collection("users").doc(uid);
  await userRef.set({
    uid,
    phoneNumber,
    createdAt: new Date().toString(),
    lastLogin: new Date().toString(),
  });
};

export const onUserSignin = async (uid: string) => {
  const userRef = db.collection("users").doc(uid);
  await userRef.update({
    lastLogin: new Date().toString(),
  });
};
