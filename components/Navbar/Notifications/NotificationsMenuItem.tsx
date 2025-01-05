import notificationsState, {
  NotificationDocType
} from "@/app/notifications/Notifications.state";
import Tooltip from "@/components/Tooltip";
import { Box, Checkbox, MenuItem, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useEffect, useState } from "react";

const NotificationsMenuItem = observer(
  ({
    notification,
    handleClose
  }: {
    notification: NotificationDocType;
    handleClose: () => void;
  }) => {
    const notificationState = notificationsState.notifications.find(
      (n) => n.id === notification.id
    );

    const [isFadingIn, setIsFadingIn] = useState(true);

    useEffect(() => {
      setIsFadingIn(false);
    }, []);

    if (!notificationState) {
      return null;
    }

    return (
      <MenuItem
        key={notification.id}
        onClick={() => {
          if (!notification.url) {
            notificationState.toggleRead();
          }
          if (notification.url) {
            handleClose();
            notificationState.markAsRead();
          }
        }}
        component={notification.url ? Link : "div"}
        href={notification.url || ""}
        sx={{
          fontSize: "14px",
          fontWeight: notification.read ? "normal" : "bold",
          transition: "all 0.3s ease",
          color: "background.default",
          flexDirection: "column",
          borderRadius: "4px",
          alignItems: "flex-start",
          padding: "0.75rem",
          opacity: notificationState!.isFadingOut || isFadingIn ? 0 : 1,
          backgroundColor: "primary.dark",

          transform:
            notificationState!.isFadingOut || isFadingIn
              ? "translateX(-100px)"
              : "translateY(0)",
          "&:hover": {
            textDecoration: notification.url ? "underline" : "none",
            backgroundColor: "var(--med-pink)"
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
            <Typography
              variant="h4"
              sx={{
                m: 0
              }}
            >
              {notification.title}
            </Typography>
            <div style={{ fontSize: "12px", color: "text.secondary" }}>
              {notification.body}
            </div>
            <Typography variant="caption" display="block">
              {notification.createdAt.toDate().toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Tooltip
              title={notification.read ? "Mark as unread" : "Mark as read"}
              offset={-8}
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
