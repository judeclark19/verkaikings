"use client";

import { db } from "@/lib/firebase";
import { Skeleton, Typography } from "@mui/material";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

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

  return (
    <div>
      <Typography variant="h1">
        {user ? `My Profile: ${user.username}` : <Skeleton />}
      </Typography>

      <Typography component="p">
        {user ? `First Name: ${user.firstName}` : <Skeleton />}
      </Typography>
      <Typography component="p">
        {user ? `Last Name: ${user.lastName}` : <Skeleton />}
      </Typography>
      <Typography component="p">
        {user ? `Email: ${user.email}` : <Skeleton />}
      </Typography>
      <Typography component="p">
        {user ? `Country: ${user.countryName}` : <Skeleton />}
      </Typography>
    </div>
  );
};

export default MyProfile;
