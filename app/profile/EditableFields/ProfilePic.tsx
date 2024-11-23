"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Box, CircularProgress, Fab } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase"; // Your Firebase setup
import { updateDoc, doc } from "firebase/firestore";
import myProfileState from "../MyProfile.state";

const ProfilePic = observer(() => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !myProfileState.userId) return;

    setLoading(true);
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(
        storage,
        `users/${myProfileState.userId}/profile.jpg`
      );
      await uploadBytes(storageRef, file);

      // Get the public download URL
      const url = await getDownloadURL(storageRef);

      // Save the URL to Firestore
      const userDoc = doc(db, "users", myProfileState.userId);
      await updateDoc(userDoc, { profilePicture: url });

      // Update local state
      myProfileState.setUser({
        ...myProfileState.user,
        profilePicture: url
      });

      console.log("Profile picture updated:", url);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 4
      }}
    >
      {/* Display the profile picture or initials */}
      <Avatar
        src={myProfileState.user?.profilePicture || ""}
        alt={`${myProfileState.user?.firstName} ${myProfileState.user?.lastName}`}
        sx={{
          width: 150,
          height: 150,
          fontSize: 40,
          bgcolor: "primary.main"
        }}
      >
        {!myProfileState.user?.profilePicture &&
          `${myProfileState.user?.firstName?.[0] || ""}${
            myProfileState.user?.lastName?.[0] || ""
          }`}
      </Avatar>

      {/* Upload button */}
      <Box>
        <input
          accept="image/*"
          id="profile-picture-upload"
          type="file"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        <label htmlFor="profile-picture-upload">
          <Fab
            color="secondary"
            aria-label="upload picture"
            component="label"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              <PhotoCameraIcon />
            )}
            <input
              accept="image/*"
              type="file"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </Fab>
        </label>
      </Box>
    </Box>
  );
});

export default ProfilePic;
