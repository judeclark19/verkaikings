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
import { Skeleton, Typography } from "@mui/material";

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

  return (
    <div>
      <Typography variant="h1">
        {user ? `UserProfile of ${user.username}` : <Skeleton />}
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

export default UserProfileOld;
