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
import Instagram from "./EditableFields/Instagram";
import placeDataCache from "@/lib/PlaceDataCache";
import ProfilePic from "./EditableFields/ProfilePic";

const MyProfile = observer(({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!placeDataCache.isInitialized) {
        console.log("Waiting for placeDataCache...");
        return;
      }

      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          myProfileState.init(userDoc.data(), userId);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching user data.");
      }
    };

    fetchUser();
  }, [userId, placeDataCache.isInitialized]); // Watch for `isInitialized`

  if (error) {
    return <div>{error}</div>;
  }

  if (
    !placeDataCache.isInitialized ||
    !myProfileState.isFetched ||
    !myProfileState.user
  ) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <Typography variant="h1">
        My Profile: {myProfileState.user.username}
      </Typography>
      <ProfilePic />
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
      <Instagram />
      <MyWillemijnStory />
    </div>
  );
});

export default MyProfile;
