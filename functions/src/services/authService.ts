/* eslint-disable linebreak-style */
import {auth, db, firestore} from "../config/firebase";

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
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};
