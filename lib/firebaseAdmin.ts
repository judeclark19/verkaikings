import * as admin from "firebase-admin";

// Decode the Base64-encoded service account key from the environment variable
const serviceAccount = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_JSON
  ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_ADMIN_JSON)
  : null;

// Check if Firebase Admin app is already initialized
if (!admin.apps.length) {
  const credential = serviceAccount
    ? admin.credential.cert(serviceAccount as admin.ServiceAccount)
    : admin.credential.applicationDefault();

  admin.initializeApp({
    credential,
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminMessaging = admin.messaging();
