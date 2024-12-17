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
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import NotificationListItem from "./NotificationsListItem";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const NotificationsList = observer(() => {
  const [initiallyUnreadIds, setInitiallyUnreadIds] = useState<string[]>([]);
  const [initiallyReadIds, setInitiallyReadIds] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!notificationsState.isInitialized) return;

    // Initialize IDs if not set
    if (!hasInitialized) {
      setInitiallyUnreadIds(
        notificationsState.unreadNotifications.map((n: DocumentData) => n.id)
      );
      setInitiallyReadIds(
        notificationsState.readNotifications.map((n: DocumentData) => n.id)
      );
      setHasInitialized(true);
    }

    // Listen for changes and update only when there are new notifications
    const currentUnreadIds = notificationsState.unreadNotifications.map(
      (n: DocumentData) => n.id
    );
    const currentReadIds = notificationsState.readNotifications.map(
      (n: DocumentData) => n.id
    );

    // Update if lengths don't match (new notification added or removed)
    setInitiallyUnreadIds((prev) =>
      prev.length !== currentUnreadIds.length ? currentUnreadIds : prev
    );
    setInitiallyReadIds((prev) =>
      prev.length !== currentReadIds.length ? currentReadIds : prev
    );
  }, [
    notificationsState.isInitialized,
    notificationsState.notifications.length
  ]);
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
                notificationsState.markAllAsRead();
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
                setInitiallyReadIds([]);
                setInitiallyUnreadIds([]);
                setHasInitialized(false);
              }}
            >
              Delete all
            </Button>
          </Box>

          {/* Unread Notifications Section */}
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Unread Notifications
          </Typography>
          {initiallyUnreadIds.length > 0 ? (
            <List>
              {initiallyUnreadIds.map((id) => {
                const notif = notificationsState.getNotificationById(id);
                if (!notif) return null;
                return <NotificationListItem notif={notif} key={id} />;
              })}
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
          {initiallyReadIds.length > 0 ? (
            <List>
              {initiallyReadIds.map((id) => {
                const notif = notificationsState.getNotificationById(id);
                if (!notif) return null;
                return <NotificationListItem notif={notif} key={id} />;
              })}
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
