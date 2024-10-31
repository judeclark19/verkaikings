"use client";

import { db } from "@/lib/firebase";
import { Typography } from "@mui/material";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfileSkeleton from "./ProfileSkeleton";
import { fetchCountryInfo } from "@/lib/clientUtils";
import { City, Country, DateOfBirth } from "./EditableFields";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";

const MyProfile = observer(({ userId }: { userId: string }) => {
  const [user, setUser] = useState<DocumentData | null>(null); // Authenticated user
  const [error, setError] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Firestore query to find user by userId
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setCountryName(userDoc.data().countryName);
          setPlaceId(userDoc.data().cityId);
          myProfileState.init(userDoc.data());
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
    async function fetchData() {
      if (placeId && user) {
        const fetchedCountryInfo = await fetchCountryInfo(placeId);
        if (fetchedCountryInfo.countryName !== user.countryName) {
          setCountryName(fetchedCountryInfo.countryName);
        }
      }
    }

    fetchData();
  }, [placeId]);

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
      <Country countryName={countryName} />
      <City
        user={user}
        userId={userId}
        setUser={setUser}
        setPlaceId={setPlaceId}
      />
      <DateOfBirth user={user} userId={userId} setUser={setUser} />
    </div>
  );
});

export default MyProfile;

// make country editable
