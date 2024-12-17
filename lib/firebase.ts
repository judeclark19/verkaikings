import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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
        // console.log("FCM Token:", token);
        const tokenRef = doc(db, "users", userId, "fcmTokens", token);
        await setDoc(tokenRef, { token, createdAt: new Date() });
      } else {
        console.warn("No registration token available.");
      }
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("Error requesting notification permission:", err);
  }
};

// Auth listener for state changes
export const authListener = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
