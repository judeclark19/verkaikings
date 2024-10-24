"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Import your Firestore instance
import UserProfile from "../UserProfile";

const UserProfileOld = () => {
  const params = useParams();
  const { username } = params;

  const [user, setUser] = useState<DocumentData | null>(null); // State to hold user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Firestore query to find user by username
        const q = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming usernames are unique, grab the first matching user
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <>{user ? <UserProfile user={user} /> : <p>No user found.</p>}</>;
};

export default UserProfileOld;
