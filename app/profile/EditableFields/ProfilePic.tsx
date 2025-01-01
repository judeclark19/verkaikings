"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Box, CircularProgress, Fab } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase"; // Your Firebase setup
import { updateDoc, doc } from "firebase/firestore";
import myProfileState from "../MyProfile.state";
import { UserDocType } from "@/lib/UserList";
import appState from "@/lib/AppState";

const ProfilePic = observer(() => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !myProfileState.userId) return;

    setLoading(true);

    const MAX_RETRIES = 3; // Limit the number of attempts
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      try {
        attempts++;
        console.log(`Upload attempt ${attempts}`);

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
        } as UserDocType);

        appState.setSnackbarMessage("Profile picture updated successfully.");

        break; // Stop retrying if upload is successful
      } catch (error) {
        console.error(`Error on upload attempt ${attempts}:`, error);
        if (attempts >= MAX_RETRIES) {
          console.error("Max upload attempts reached. Stopping retries.");
          alert("Failed to upload profile picture. Please try again later.");
        }
      }
    }

    setLoading(false);
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
        variant="square"
        sx={{
          width: 200,
          height: 200,
          fontSize: 40,
          bgcolor: "secondary.main",
          borderRadius: 2
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
            size="small"
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
