"use client";

import { Box, Divider, Fab, Paper, Typography } from "@mui/material";
import ProfileSkeleton from "./ProfileSkeleton";
import {
  City,
  Country,
  DateOfBirth,
  Instagram,
  MyWillemijnStory,
  ProfilePic
} from "./EditableFields";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";
import appState from "@/lib/AppState";
import SandboxSkeleton from "../sandbox/SandboxSkeleton";
import ContactItem from "../sandbox/ContactItem";
import ReadOnlyContactItem from "../sandbox/ReadOnlyContactItem";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  Phone as PhoneIcon,
  Wc as WcIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon
} from "@mui/icons-material";

import { FaInstagram } from "react-icons/fa";
import BeRealIcon from "../../public/images/icons8-bereal-24.svg";
import DuolingoIcon from "../../public/images/icons8-duolingo-24.svg";
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
            <ContactItem
              initialValue="instagram"
              icon={<FaInstagram size={24} />}
            />
            <ContactItem
              initialValue="duolingo"
              icon={<DuolingoIcon size={24} />}
            />

            <ContactItem initialValue="bereal" icon={<BeRealIcon />} />
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
              icon={<PhoneIcon />}
            />
            <DateOfBirth />
            <ContactItem initialValue="pronouns" icon={<WcIcon />} />
            <ContactItem initialValue="city" icon={<LocationCityIcon />} />
            <ContactItem initialValue="country" icon={<PublicIcon />} />
          </Box>

          <Divider />
          {/* SECOND SECTION - MY WILLEMIJN STORY */}
          <Box>
            <Typography variant="h2">My Willemijn Story</Typography>
            <Typography component="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              libero voluptate dignissimos minus. Quos, dolor quisquam possimus
              et vero illo illum aspernatur excepturi sapiente incidunt enim
              hic! Vitae ea inventore eligendi ut numquam nesciunt, veritatis
              quisquam velit tenetur laborum sed, voluptate repudiandae
              distinctio minima quo corporis possimus amet iure enim!
            </Typography>
            <Box
              sx={{
                marginTop: 1,
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Fab
                size="medium"
                color="primary"
                aria-label="edit"
                onClick={() => {
                  //   setIsEditing(true);
                }}
              >
                <EditIcon />
              </Fab>
            </Box>
          </Box>
        </Box>
      </Box>

      <div
        style={{
          backgroundColor: "#555"
        }}
      >
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
        <Typography component="p">
          Email: {myProfileState.user.email}
        </Typography>
        <Typography component="p">
          WhatsApp phone: {myProfileState.user.phoneNumber}
        </Typography>
        <Country />
        <City />
        <DateOfBirth />
        <Instagram />
        <MyWillemijnStory />
      </div>
    </>
  );
});

export default MyProfile;
