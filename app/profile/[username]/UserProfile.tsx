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
import { db } from "@/lib/firebase";
import { Typography } from "@mui/material";
import ProfileSkeleton from "../ProfileSkeleton";

const UserProfileOld = () => {
  const params = useParams();
  const { username } = params;

  const [user, setUser] = useState<DocumentData | null>(null); // State to hold user data
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
          setError(`User with username ${username} not found.`);
        }
      } catch (err) {
        setError("Error fetching user data.");
      }
    };

    fetchUser();
  }, [username]);

  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <Typography variant="h1">User Profile: {user.username}</Typography>
      <Typography component="p">First Name: {user.firstName}</Typography>
      <Typography component="p">Last Name: {user.lastName}</Typography>
      <Typography component="p">Email: {user.email}</Typography>
      <Typography component="p">Country: {user.countryName}</Typography>
      {user.bithday && (
        <Typography component="p">Birthday: {user.birthday}</Typography>
      )}
    </div>
  );
};

export default UserProfileOld;
