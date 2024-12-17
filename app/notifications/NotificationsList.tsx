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
    if (notificationsState.isInitialized && !hasInitialized) {
      // On first initialization, store the IDs preserving their initial category.
      const unreadIds = notificationsState.unreadNotifications.map(
        (n: DocumentData) => n.id
      );
      const readIds = notificationsState.readNotifications.map(
        (n: DocumentData) => n.id
      );
      setInitiallyUnreadIds(unreadIds);
      setInitiallyReadIds(readIds);
      setHasInitialized(true);
    }
  }, [notificationsState.isInitialized, hasInitialized]);

  // Effect to handle new notifications coming in after initialization
  useEffect(() => {
    if (!notificationsState.isInitialized || !hasInitialized) return;

    const knownUnread = new Set(initiallyUnreadIds);
    const knownRead = new Set(initiallyReadIds);

    // Check for new unread notifications
    const currentUnreadIds = notificationsState.unreadNotifications.map(
      (n: DocumentData) => n.id
    );
    const newUnread = currentUnreadIds.filter(
      (id) => !knownUnread.has(id) && !knownRead.has(id)
    );
    if (newUnread.length > 0) {
      // Prepend new unread IDs so newer ones appear at the top
      setInitiallyUnreadIds((prev) => [...newUnread, ...prev]);
    }

    // Check for new read notifications
    const currentReadIds = notificationsState.readNotifications.map(
      (n: DocumentData) => n.id
    );
    const newRead = currentReadIds.filter(
      (id) => !knownUnread.has(id) && !knownRead.has(id)
    );
    if (newRead.length > 0) {
      // Keep read notifications appended at the bottom as before
      setInitiallyReadIds((prev) => [...prev, ...newRead]);
    }
  }, [
    notificationsState.notifications.length,
    notificationsState.isInitialized,
    hasInitialized
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
