import myProfileState from "@/app/profile/MyProfile.state";
import { Badge, Button, Menu, MenuItem } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { observer } from "mobx-react-lite";
import { useState, MouseEvent } from "react";
import Link from "next/link";

import NotificationsIcon from "@mui/icons-material/Notifications"; // Regular bell icon
// Or import NotificationsActiveIcon for a ringing bell
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import notificationsState from "@/app/profile/Notifications.state";

const NotificationsDropdown = observer(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notifId: string) => {
    const userId = myProfileState.userId;
    if (!userId) return;

    try {
      const notifRef = doc(db, `users/${userId}/notifications`, notifId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        id="submenu-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{
          fontWeight: open ? "700" : "400",
          display: "flex",
          alignItems: "center",
          height: "100%",
          backgroundColor: open ? "primary.main" : "transparent",
          "&:hover": { backgroundColor: "primary.main" },
          "&[aria-expanded='true']": { backgroundColor: "primary.main" }
        }}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "rotate(360deg)"
            }}
          />
        }
      >
        {notificationsState.notifications.some((notif) => !notif.read) ? (
          <Badge
            badgeContent={notificationsState.unreadNotifications.length}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                right: 4,
                top: 4,
                backgroundColor: "secondary.dark",
                color: "white"
              }
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 24 }} />
          </Badge>
        ) : (
          <NotificationsIcon sx={{ fontSize: 24 }} />
        )}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "submenu-button",
          role: "menu"
        }}
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "primary.dark",
            color: "text.primary"
          },
          "& .MuiMenu-list": {
            backgroundColor: "primary.dark"
          }
        }}
      >
        {notificationsState.unreadNotifications.length === 0 ? (
          <MenuItem
            sx={{
              fontSize: "14px",
              fontWeight: "normal",
              color: "background.default",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0.75rem 1.5rem",
              pointerEvents: "none",
              opacity: 0.7
            }}
          >
            No unread notifications
          </MenuItem>
        ) : (
          notificationsState.notifications
            .filter((notif) => !notif.read)
            .slice(0, 5)
            .map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => {
                  markAsRead(notif.id); // Mark notification as read
                  if (notif.url) handleClose();
                }}
                component={notif.url ? Link : "div"}
                href={notif.url}
                sx={{
                  fontSize: "14px",
                  fontWeight: notif.read ? "normal" : "bold", // Bold if unread
                  transition: "background-color 0.3s ease",
                  color: "background.default",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  "&:hover": {
                    textDecoration: notif.url ? "underline" : "none",
                    backgroundColor: "primary.main"
                  },
                  padding: "0.75rem 1.5rem"
                }}
              >
                <span>{notif.title.toUpperCase()}</span>
                <span style={{ fontSize: "12px", color: "text.secondary" }}>
                  {notif.body}
                </span>
              </MenuItem>
            ))
        )}

        <MenuItem
          onClick={handleClose}
          component={Link}
          href="/notifications"
          sx={{
            fontWeight: "700",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
            backgroundColor: "primary.dark",
            color: "background.default",
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: "primary.main"
            },
            padding: "0.75rem 1.5rem"
          }}
        >
          See all
        </MenuItem>
      </Menu>
    </div>
  );
});

export default NotificationsDropdown;
