import notificationsState from "@/app/notifications/Notifications.state";
import myProfileState from "@/app/profile/MyProfile.state";
import { db } from "@/lib/firebase";
import { Box, Checkbox, MenuItem } from "@mui/material";
import { DocumentData } from "firebase-admin/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const NotificationsMenuItem = observer(
  ({
    notification,
    handleClose
  }: {
    notification: DocumentData;
    handleClose: () => void;
  }) => {
    return (
      <MenuItem
        key={notification.id}
        onClick={() => {
          if (!notification.url) {
            notification.toggleRead();
          }
          if (notification.url) {
            handleClose();
            notification.markAsRead();
          }
        }}
        component={notification.url ? Link : "div"}
        href={notification.url}
        sx={{
          fontSize: "14px",
          fontWeight: notification.read ? "normal" : "bold", // Bold if unread
          transition: "background-color 0.3s ease",
          color: "background.default",
          flexDirection: "column",
          alignItems: "flex-start",
          "&:hover": {
            textDecoration: notification.url ? "underline" : "none",
            backgroundColor: "primary.main"
          },
          padding: "0.75rem 1.5rem"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "1rem"
          }}
        >
          <Box>
            <div>{notification.title.toUpperCase()}</div>
            <div style={{ fontSize: "12px", color: "text.secondary" }}>
              {notification.body}
            </div>
          </Box>
          <Box>
            <Checkbox
              checked={!!notification.read}
              onClick={(e) => e.stopPropagation()}
              sx={{
                p: 0,
                "& .MuiSvgIcon-root": {
                  fontSize: "1rem"
                },
                color: "background.default",
                "&.Mui-checked": {
                  color: "background.default"
                }
              }}
              onChange={() => {
                notification.toggleRead();
              }}
            />
          </Box>
        </Box>
      </MenuItem>
    );
  }
);

export default NotificationsMenuItem;
