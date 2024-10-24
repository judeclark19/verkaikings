"use client";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";

const MyProfile = () => {
  const [user, setUser] = useState<DocumentData | null>(null); // Authenticated user
  //   const [userData, setUserData] = useState<any>(null); // Firestore user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // setUser(currentUser); // Set the current user from Firebase Auth

        try {
          // Fetch user data from Firestore using the user's UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          console.log("trying");

          if (userDoc.exists()) {
            console.log("User data:", userDoc.data());
            setUser(userDoc.data()); // Set Firestore user data
            // setUserData(userDoc.data()); // Set Firestore user data
          } else {
            console.log("No user data found in the database.");
            setError("No user data found in the database.");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data.");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <>{user ? <UserProfile user={user} /> : <p>No user found.</p>}</>;
};

export default MyProfile;
