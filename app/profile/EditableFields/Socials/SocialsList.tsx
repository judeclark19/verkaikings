import { Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import myProfileState from "../../MyProfile.state";
import { Email as EmailIcon } from "@mui/icons-material";
import { Instagram, Duolingo, BeReal } from "./index";
import EmailChangeModal from "../../components/EmailChangeModal";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "76px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%"
          }}
        >
          <EmailIcon />

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "14px"
            }}
          >
            <Typography
              sx={{
                wordBreak: "break-all"
              }}
            >
              {myProfileState.email}
            </Typography>
          </div>
        </div>
        <EmailChangeModal />
      </div>
      <Instagram />
      <Duolingo />
      <BeReal />
    </Paper>
  );
});

export default SocialsList;
