"use client";

import { Typography } from "@mui/material";
import ProfileSkeleton from "./ProfileSkeleton";
import { City, Country, DateOfBirth } from "./EditableFields";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";
import MyWillemijnStory from "./EditableFields/MyWillemijnStory";
import Instagram from "./EditableFields/Instagram";
import appState from "@/lib/AppState";
import ProfilePic from "./EditableFields/ProfilePic";

const MyProfile = observer(() => {
  if (
    !appState.isInitialized ||
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
