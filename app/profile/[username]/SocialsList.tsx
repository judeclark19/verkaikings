import { Paper, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import React from "react";
import ReadOnlyContactItem from "../components/ReadOnlyContactItem";
import {
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  Instagram as InstagramIcon,
  Cake as CakeIcon,
  Public as PublicIcon
} from "@mui/icons-material";
import BeRealIcon from "../../../public/images/icons8-bereal-24.svg";
import DuolingoIcon from "../../../public/images/icons8-duolingo-24.svg";

function SocialsList({ user }: { user: DocumentData }) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center", marginTop: 0 }}>
        Socials
      </Typography>
      <ReadOnlyContactItem value={user.email} icon={<EmailIcon />} />

      {user.instagram && (
        <ReadOnlyContactItem
          value={user.instagram}
          icon={<InstagramIcon />}
          link={`https://instagram.com/${user.instagram}`}
        />
      )}

      {user.duolingo && (
        <ReadOnlyContactItem
          value={user.duolingo}
          icon={
            <DuolingoIcon
              size={24}
              style={{
                flexShrink: 0
              }}
            />
          }
          link={`https://www.duolingo.com/profile/${user.duolingo}`}
        />
      )}

      {user.beReal && (
        <ReadOnlyContactItem
          value={user.beReal}
          icon={
            <BeRealIcon
              size={24}
              style={{
                flexShrink: 0
              }}
            />
          }
        />
      )}
    </Paper>
  );
}

export default SocialsList;
