"use client";

import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import {
  City,
  Country,
  DateOfBirth,
  MyWillemijnStory,
  ProfilePic,
  Pronouns,
  Username,
  SocialsList
} from "./EditableFields";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";
import appState from "@/lib/AppState";
import {
  ProfileSkeleton,
  ReadOnlyContactItem,
  NameEditingModal,
  PasswordChangeModal
} from "./components";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { FaWhatsapp } from "react-icons/fa";
import { checkIfBirthdayToday } from "@/lib/clientUtils";
import { db } from "@/lib/firebase";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

const MyProfile = observer(() => {
  useEffect(() => {
    // Ensure we have a userId to subscribe to
    const userId = myProfileState.userId; // Assume userId is stored in your state
    if (!userId) return;

    // Firestore subscription to user document
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        // Update MobX state with user data
        myProfileState.setUser(docSnapshot.data());
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  if (
    !appState.isInitialized ||
    !myProfileState.isFetched ||
    !myProfileState.user
  ) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      {/* Back button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          justifyContent: "center",
          gap: {
            xs: 0,
            md: 3
          }
        }}
      >
        {/* SIDEBAR */}
        <Box
          sx={{
            maxWidth: "100%",
            flexShrink: 0,
            width: {
              xs: "100%",
              md: "360px"
            }
          }}
        >
          <ProfilePic />
          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none"
              },
              alignItems: "center",
              justifyContent: "center",
              columnGap: 3,
              flexWrap: "wrap"
            }}
          >
            <Typography
              variant="h1"
              sx={{
                textAlign: "center"
              }}
            >
              {myProfileState.user.firstName} {myProfileState.user.lastName}{" "}
              {""}
              {checkIfBirthdayToday(myProfileState.user.birthday) && "🎂"}
            </Typography>
            <NameEditingModal />
          </Box>
          <Box
            sx={{
              display: {
                xs: "none",
                md: "block"
              },
              mt: 3
            }}
          >
            <SocialsList />
          </Box>
        </Box>
        {/* MAIN CONTENT */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: {
              xs: "100%",
              md: "800px"
            }
          }}
        >
          {/* FIRST SECTION - CONTACT DETAILS */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex"
              },
              alignItems: "center",
              columnGap: 4
            }}
          >
            <Typography variant="h1">
              {myProfileState.user.firstName} {myProfileState.user.lastName}{" "}
              {checkIfBirthdayToday(myProfileState.user.birthday) && "🎂"}
            </Typography>
            <NameEditingModal />
          </Box>
          <Paper elevation={6} sx={{ px: 3 }}>
            <Box
              sx={{
                display: "grid",
                columnGap: 6,
                rowGap: 0,
                gridTemplateColumns: {
                  xs: "repeat(auto-fit, 100%)",
                  md: "repeat(auto-fit, 300px)"
                },
                justifyContent: {
                  xs: "center",
                  md: "start"
                }
              }}
            >
              <Username />
              <ReadOnlyContactItem
                value={myProfileState.user.phoneNumber}
                icon={<FaWhatsapp size={24} />}
                height="76px"
              />
              <DateOfBirth />
              <Pronouns />
              <City />
              <Country />
            </Box>
          </Paper>

          <Divider />

          <Box
            sx={{
              display: {
                xs: "block",
                md: "none"
              },
              mt: 3
            }}
          >
            <SocialsList />
          </Box>

          {/* SECOND SECTION - MY WILLEMIJN STORY */}
          <MyWillemijnStory />

          {/* THIRD SECTION - SUPPORT*/}
          <Box
            sx={{
              mt: 3
            }}
          >
            <Typography variant="h2">Change Password</Typography>
            <PasswordChangeModal />
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default MyProfile;
