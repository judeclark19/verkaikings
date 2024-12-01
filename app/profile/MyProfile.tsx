"use client";

import { Box, Divider, Paper, Typography } from "@mui/material";
import ProfileSkeleton from "./ProfileSkeleton";
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
import SandboxSkeleton from "../sandbox/SandboxSkeleton";
import ContactItem from "../sandbox/ContactItem";
import ReadOnlyContactItem from "../sandbox/ReadOnlyContactItem";
import {
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon
} from "@mui/icons-material";

import { FaTransgender, FaWhatsapp } from "react-icons/fa";
import { getEmojiFlag } from "countries-list";

const MyProfile = observer(() => {
  if (
    !appState.isInitialized ||
    !myProfileState.isFetched ||
    !myProfileState.user
  ) {
    return <SandboxSkeleton />;
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
              md: "300px"
            }
          }}
        >
          <ProfilePic />
          <br />
          <Typography
            variant="h1"
            display={{
              xs: "block",
              md: "none"
            }}
            sx={{
              textAlign: "center"
            }}
          >
            {myProfileState.user.firstName} {myProfileState.user.lastName} {""}
            <span>
              {getEmojiFlag(myProfileState.user.countryAbbr.toUpperCase())}
            </span>
          </Typography>
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
            {/* <ContactItem
              initialValue="instagram"
              icon={<FaInstagram size={24} />}
            /> */}
            <Instagram />
            <Duolingo />
            <BeReal />
            {/* <ContactItem initialValue="bereal" icon={<BeRealIcon />} /> */}
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
          <Typography
            variant="h1"
            display={{
              xs: "none",
              md: "block"
            }}
          >
            {myProfileState.user.firstName} {myProfileState.user.lastName}{" "}
            <span>
              {getEmojiFlag(myProfileState.user.countryAbbr.toUpperCase())}
            </span>
          </Typography>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
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
            <ReadOnlyContactItem
              value={myProfileState.user.username}
              icon={<AccountCircleIcon />}
            />
            <ReadOnlyContactItem
              value={myProfileState.user.phoneNumber}
              icon={<FaWhatsapp size={24} />}
            />
            <DateOfBirth />
            {/* <ContactItem
              initialValue="pronouns"
              icon={<FaTransgender size={24} />}
            /> */}
            <Pronouns />
            <City />
            <Country />
          </Box>

          <Divider />
          {/* SECOND SECTION - MY WILLEMIJN STORY */}
          <MyWillemijnStory />
        </Box>
      </Box>
    </>
  );
});

export default MyProfile;
