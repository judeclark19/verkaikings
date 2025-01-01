"use client";

import {
  Box,
  Typography,
  List,
  Divider,
  Skeleton,
  Button
} from "@mui/material";
import { observer } from "mobx-react-lite";
import notificationsState from "./Notifications.state";
import NotificationListItem from "./NotificationsListItem";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import appState from "@/lib/AppState";

const NotificationsList = observer(() => {
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const visibilityMap: {
      [key: string]: boolean;
    } = {};

    notificationsState.notifications.forEach((notif) => {
      visibilityMap[notif.id] = true;
    });

    setVisibility(visibilityMap);
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Notifications
      </Typography>
      {notificationsState.isInitialized ? (
        <Box sx={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "3rem"
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                cursor: "pointer"
              }}
              disabled={notificationsState.unreadNotifications.length === 0}
              onClick={() => {
                const newVisibility = { ...visibility };
                notificationsState.unreadNotifications.forEach((notif) => {
                  newVisibility[notif.id] = false;
                });
                setVisibility(newVisibility);

                setTimeout(() => {
                  notificationsState.markAllAsRead();
                  appState.setSnackbarMessage(
                    "All notifications marked as read."
                  );
                }, 300);
              }}
            >
              Mark all as read
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                cursor: "pointer"
              }}
              disabled={notificationsState.notifications.length === 0}
              onClick={() => {
                notificationsState.deleteAll();
                appState.setSnackbarMessage("All notifications deleted.");
              }}
            >
              Delete all
            </Button>
          </Box>

          {/* Unread Notifications Section */}
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Unread Notifications
          </Typography>
          {notificationsState.unreadNotifications.length > 0 ? (
            <List>
              {notificationsState.unreadNotifications.map((notif) => (
                <NotificationListItem
                  notif={notif}
                  key={`${notif.id}-${notif.read}`}
                  visibility={visibility}
                  setVisibility={setVisibility}
                />
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No unread notifications.
            </Typography>
          )}

          <Divider sx={{ marginY: "1rem" }} />

          {/* Read Notifications Section */}
          <Typography variant="h3" gutterBottom>
            Read Notifications
          </Typography>
          {notificationsState.readNotifications.length > 0 ? (
            <List>
              {notificationsState.readNotifications.map((notif) => (
                <NotificationListItem
                  notif={notif}
                  key={`${notif.id}-${notif.read}`}
                  visibility={visibility}
                  setVisibility={setVisibility}
                />
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No read notifications.
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            padding: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
            height: "500px"
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
      )}
    </>
  );
});

export default NotificationsList;
