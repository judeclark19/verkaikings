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
import { fetchCityName, formatBirthday } from "@/lib/clientUtils";

const UserProfile = () => {
  const params = useParams();
  const { username } = params;
  const [userLocale, setUserLocale] = useState<string>("nl");
  const [user, setUser] = useState<DocumentData | null>(null); // State to hold user data
  const [error, setError] = useState(""); // Error state
  const [cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    setUserLocale(navigator.language || "nl"); // Default to "nl" if not detected
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
          document.title = `${userData.username}'s Profile | Verkaikings`; // Set the document title
        } else {
          setError(`User with username ${username} not found.`);
        }
      } catch (err) {
        setError("Error fetching user data.");
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    if (!user) {
      document.title = `Loading Profile...`;
    }

    if (user) {
      fetchCityName(user, setCityName);
    }
  }, [user]);

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
      <Typography component="p">WhatsApp phone: {user.phoneNumber}</Typography>
      <Typography component="p">Country: {user.countryName}</Typography>
      <Typography component="p">City: {cityName}</Typography>
      {user.birthday && (
        <Typography component="p">
          Birthday:{user.birthday} {formatBirthday(user.birthday)}
        </Typography>
      )}
    </div>
  );
};

export default UserProfile;
