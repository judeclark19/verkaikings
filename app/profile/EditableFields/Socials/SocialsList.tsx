import { Paper, Typography } from "@mui/material";
import React from "react";
import ReadOnlyContactItem from "../../components/ReadOnlyContactItem";
import { observer } from "mobx-react-lite";
import myProfileState from "../../MyProfile.state";
import { Email as EmailIcon } from "@mui/icons-material";
import { Instagram, Duolingo, BeReal } from "./index";

const SocialsList = observer(() => {
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
      <ReadOnlyContactItem
        value={myProfileState.user!.email}
        icon={<EmailIcon />}
      />
      <Instagram />
      <Duolingo />
      <BeReal />
    </Paper>
  );
});

export default SocialsList;
