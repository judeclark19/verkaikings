"use client";

import { Box, Divider, Paper, Typography } from "@mui/material";
import {
  City,
  Country,
  DateOfBirth,
  Instagram,
  MyWillemijnStory,
  ProfilePic,
  Duolingo,
  BeReal,
  Pronouns
} from "./EditableFields";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";
import appState from "@/lib/AppState";
import ProfileSkeleton from "./components/ProfileSkeleton";
import ReadOnlyContactItem from "./components/ReadOnlyContactItem";
import { Email as EmailIcon } from "@mui/icons-material";

import { FaWhatsapp } from "react-icons/fa";
import { checkIfBirthdayToday } from "@/lib/clientUtils";
import NameEditingModal from "./components/NameEditingModal/NameEditingModal";
import Username from "./EditableFields/Username";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          justifyContent: "center",
          gap: 3
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
          <br />
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
          <Paper
            elevation={3}
            sx={{
              padding: 3
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center", marginTop: 0 }}>
              Socials
            </Typography>
            <ReadOnlyContactItem
              value={myProfileState.user.email}
              icon={<EmailIcon />}
            />
            <Instagram />
            <Duolingo />
            <BeReal />
          </Paper>
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
          <Box
            sx={{
              display: "grid",
              columnGap: 6,
              rowGap: 0
            }}
            gridTemplateColumns={{
              xs: "repeat(auto-fit, 100%)",
              sm: "repeat(auto-fit, 300px)"
            }}
            justifyContent={{
              xs: "center",
              md: "start"
            }}
          >
            <Username />
            <ReadOnlyContactItem
              value={myProfileState.user.phoneNumber}
              icon={<FaWhatsapp size={24} />}
            />
            <DateOfBirth />
            <Pronouns />
            <City />
            <Country />
          </Box>

          <Divider />
          {/* SECOND SECTION - MY WILLEMIJN STORY */}
          <MyWillemijnStory />

          {/* THIRD SECTION - SUPPORT*/}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h2">Email and password</Typography>
            <Typography>
              If you need to change your email or password, please contact the
              webmaster Jude (+17703801397) on WhatsApp.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default MyProfile;
