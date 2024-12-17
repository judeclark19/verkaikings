import { Typography } from "@mui/material";
import { Metadata } from "next";
import NotificationsList from "./NotificationsList";

export const metadata: Metadata = {
  title: "Notifications | Willemijn's World Website"
};

function Notifications() {
  return (
    <div>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Notifications
      </Typography>
      <NotificationsList />
    </div>
  );
}

export default Notifications;
