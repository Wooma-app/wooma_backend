import * as admin from "firebase-admin";
import * as _functions from "firebase-functions";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";

import serviceAccount from "./serviceAccount.json";

const credentials = serviceAccount as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: "wooma-488f1.firebasestorage.app",
});

export const db = getFirestore("wooma-db");
export const firestore = admin.firestore;
export const auth = admin.auth();
export const storage = getStorage();
export const functions = _functions;
