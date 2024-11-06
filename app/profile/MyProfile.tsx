"use client";

import { db } from "@/lib/firebase";
import { Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfileSkeleton from "./ProfileSkeleton";
import { City, Country, DateOfBirth } from "./EditableFields";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";
import MyWillemijnStory from "./EditableFields/MyWillemijnStory";

const MyProfile = observer(({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Firestore query to find user by userId
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          myProfileState.init(userDoc.data(), userId);
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

  if (!myProfileState.isFetched || !myProfileState.user) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <Typography variant="h1">
        My Profile: {myProfileState.user.username}
      </Typography>
      <Typography component="p">
        First Name: {myProfileState.user.firstName}
      </Typography>
      <Typography component="p">
        Last Name: {myProfileState.user.lastName}
      </Typography>
      <Typography component="p">Email: {myProfileState.user.email}</Typography>
      <Typography component="p">
        WhatsApp phone: {myProfileState.user.phoneNumber}
      </Typography>
      <Country />
      <City />
      <DateOfBirth />
      <MyWillemijnStory />
    </div>
  );
});

export default MyProfile;
