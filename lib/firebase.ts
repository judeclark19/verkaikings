import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { isSupported, getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase has already been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth
export const auth: Auth = getAuth(app);

// Firestore
export const db = getFirestore(app); // Initialize Firestore

// Storage
export const storage = getStorage(app);

// Messaging

let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
    }
  });
}

let requestAttempts = 0;

export const requestNotificationPermission = async (userId: string) => {
  if (!messaging) {
    console.warn("Messaging not initialized or unsupported.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      if (token) {
        console.log("Generated FCM Token");

        const tokensRef = collection(db, "users", userId, "fcmTokens");

        // Fetch all tokens
        const tokensSnapshot = await getDocs(tokensRef);
        const now = new Date();
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        let isStale = false;

        // Check all tokens for staleness and delete if necessary
        for (const doc of tokensSnapshot.docs) {
          const tokenData = doc.data();
          const createdAt = tokenData.createdAt?.toDate();

          if (createdAt && createdAt < ninetyDaysAgo) {
            // Token is stale, delete it
            await deleteDoc(doc.ref);
            console.log(`Deleted stale token: ${doc.id}`);
          }

          if (doc.id === token) {
            // Check if the generated token is stale
            if (createdAt && createdAt < ninetyDaysAgo) {
              isStale = true;
            }
          }
        }

        // Handle the generated token
        const tokenRef = doc(tokensRef, token);
        if (isStale) {
          // Update createdAt for stale token
          await setDoc(tokenRef, { token, createdAt: now }, { merge: true });
          console.log("Updated stale token with new createdAt timestamp.");
        } else {
          const existingTokenDoc = await getDoc(tokenRef);
          if (!existingTokenDoc.exists()) {
            // Save new token
            await setDoc(tokenRef, { token, createdAt: now });
            console.log("Saved new FCM token to db.");
          } else {
            console.log("Token already exists and is not stale.");
          }
        }
      }
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("Error requesting notification permission:", err);

    if (requestAttempts < 3) {
      requestAttempts++;
      setTimeout(() => requestNotificationPermission(userId), 0);
    }
  }
};

// Auth listener for state changes
export const authListener = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
