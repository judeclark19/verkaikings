import notificationsState from "@/app/notifications/Notifications.state";
import { Box, Checkbox, MenuItem, Tooltip, Typography } from "@mui/material";
import { DocumentData } from "firebase-admin/firestore";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useEffect, useState } from "react";

const NotificationsMenuItem = observer(
  ({
    notification,
    handleClose
  }: {
    notification: DocumentData;
    handleClose: () => void;
  }) => {
    const notificationState = notificationsState.notifications.find(
      (n) => n.id === notification.id
    );

    const [isFadingIn, setIsFadingIn] = useState(true);

    useEffect(() => {
      setIsFadingIn(false);
    }, []);

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
          transition: "all 0.3s ease",
          color: "background.default",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "0.75rem",
          opacity: notificationState!.isFadingOut || isFadingIn ? 0 : 1, // Fade out
          backgroundColor: "primary.dark",

          transform:
            notificationState!.isFadingOut || isFadingIn
              ? "translateX(-100px)"
              : "translateY(0)",
          "&:hover": {
            textDecoration: notification.url ? "underline" : "none",
            backgroundColor: "primary.main"
          }
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
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              {notification.createdAt.toDate().toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Tooltip
              title={notification.read ? "Mark as unread" : "Mark as read"}
              placement="top"
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -8] // Adjust this to move it down (X, Y offset)
                    }
                  }
                ]
              }}
            >
              <Checkbox
                checked={!!notification.read}
                onClick={(e) => e.stopPropagation()}
                size="small"
                sx={{
                  p: 0,
                  color: "background.default",
                  "&.Mui-checked": {
                    color: "background.default"
                  }
                }}
                onChange={() => {
                  notificationState?.setIsFadingOut(true);
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      </MenuItem>
    );
  }
);

export default NotificationsMenuItem;
