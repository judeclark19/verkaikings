import { Typography } from "@mui/material";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";

import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import NameEditingModal from "../components/NameEditingModal/NameEditingModal";

const Username = observer(() => {
  return (
    <div
      style={{
        height: "76px",
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}
    >
      <AccountCircleIcon />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexGrow: 1
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "inherit",
            flexGrow: 1
          }}
        >
          {myProfileState.user!.username}
        </Typography>

        <NameEditingModal />
      </div>
    </div>
  );
});

export default Username;
