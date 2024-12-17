import * as admin from "firebase-admin";

// Decode the Base64-encoded service account key from the environment variable
const serviceAccount = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_64
  ? JSON.parse(
      Buffer.from(process.env.NEXT_PUBLIC_FIREBASE_ADMIN_64, "base64").toString(
        "utf-8"
      )
    )
  : null;

// Check if Firebase Admin app is already initialized
if (!admin.apps.length) {
  const credential = serviceAccount
    ? admin.credential.cert(serviceAccount as admin.ServiceAccount) // Use the decoded service account if available
    : admin.credential.applicationDefault(); // Fallback to default credentials

  admin.initializeApp({
    credential,
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminMessaging = admin.messaging();
