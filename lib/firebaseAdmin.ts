import * as admin from "firebase-admin";
import serviceAccount from "../verkaikings-firebase-adminsdk.json"; // Adjust path if needed

// Check if Firebase Admin app is already initialized
if (!admin.apps.length) {
  const credential = serviceAccount
    ? admin.credential.cert(serviceAccount as admin.ServiceAccount) // Use the local JSON file if available
    : admin.credential.applicationDefault(); // Fallback to default credentials

  admin.initializeApp({
    credential,
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
