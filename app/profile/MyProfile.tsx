"use client";

import { db } from "@/lib/firebase";
import { Typography } from "@mui/material";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfileSkeleton from "./ProfileSkeleton";
import DateOfBirth from "./EditableFields/DateOfBirth";
import City from "./EditableFields/City";
import { fetchCityName } from "@/lib/clientUtils";

const MyProfile = ({ userId }: { userId: string }) => {
  const [userLocale, setUserLocale] = useState<string>("nl");
  const [user, setUser] = useState<DocumentData | null>(null); // Authenticated user
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [cityId, setCityId] = useState<string | null>(null);

  useEffect(() => {
    setUserLocale(navigator.language || "nl"); // Default to "nl" if not detected
    const fetchUser = async () => {
      try {
        // Firestore query to find user by userId
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          console.log(userDoc.data());
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Error fetching user data.");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
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
      <Typography variant="h1">My Profile: {user.username}</Typography>
      <Typography component="p">First Name: {user.firstName}</Typography>
      <Typography component="p">Last Name: {user.lastName}</Typography>
      <Typography component="p">Email: {user.email}</Typography>
      <Typography component="p">WhatsApp phone: {user.phoneNumber}</Typography>
      <Typography component="p">Country: {user.countryName}</Typography>
      <City user={user} userId={userId} setUser={setUser} />
      <DateOfBirth user={user} userId={userId} setUser={setUser} />
    </div>
  );
};

export default MyProfile;
