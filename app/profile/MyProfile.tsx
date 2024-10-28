"use client";

import { db } from "@/lib/firebase";
import { Typography } from "@mui/material";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import DateOfBirthPicker from "./DateOfBirthPicker";
import ProfileSkeleton from "./ProfileSkeleton";

const MyProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<DocumentData | null>(null); // Authenticated user
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Firestore query to find user by userId
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Error fetching user data.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <Typography variant="h1">My Profile: {user.username}</Typography>
      <Typography component="p">First Name: {user.firstName}</Typography>
      <Typography component="p">Last Name: {user.lastName}</Typography>
      <Typography component="p">Email: {user.email}</Typography>
      <Typography component="p">Country: {user.countryName}</Typography>
      <DateOfBirthPicker label="Birthday" userId={userId} user={user} />
    </div>
  );
};

export default MyProfile;
