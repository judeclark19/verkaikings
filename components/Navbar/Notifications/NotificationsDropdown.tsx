import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { observer } from "mobx-react-lite";
import { useState, MouseEvent } from "react";
import Link from "next/link";

import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon
} from "@mui/icons-material";
import notificationsState from "@/app/notifications/Notifications.state";
import NotificationsMenuItem from "./NotificationsMenuItem";

const NotificationsDropdown = observer(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markTheseAsRead = () => {
    const loopTo = Math.min(5, notificationsState.unreadNotifications.length);

    for (let i = 0; i < loopTo; i++) {
      notificationsState.unreadNotifications[i].setIsFadingOut(true);
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
        {!notificationsState.isInitialized && (
          <CircularProgress color="inherit" size={24} />
        )}

        {notificationsState.isInitialized &&
          notificationsState.notifications.some((notif) => !notif.read) && (
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
          )}

        {notificationsState.isInitialized &&
          !notificationsState.notifications.some((notif) => !notif.read) && (
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
            color: "text.primary"
          },
          "& .MuiMenu-list": {
            minWidth: "250px",
            backgroundColor: "rgb(75,75,75)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            p: 1
          }
        }}
      >
        {notificationsState.unreadNotifications.length === 0 ? (
          <MenuItem
            sx={{
              fontWeight: "normal",
              backgroundColor: "transparent",
              color: "text.primary",
              flexDirection: "column",
              padding: "0.75rem 1.5rem",
              pointerEvents: "none",
              opacity: 0.7,
              display: "flex",
              alignItems: "center"
            }}
          >
            {notificationsState.isInitialized ? (
              <Typography component="span">No unread notifications.</Typography>
            ) : (
              <CircularProgress color="inherit" size={24} />
            )}
          </MenuItem>
        ) : (
          notificationsState.unreadNotifications
            .slice(0, 5)
            .map((notification) => (
              <NotificationsMenuItem
                key={notification.id}
                notification={notification}
                handleClose={handleClose}
              />
            ))
        )}
        <Box>
          {notificationsState.unreadNotifications.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={markTheseAsRead}
              sx={{
                cursor: "pointer",
                width: "100%",
                padding: "0.5rem"
              }}
            >
              Mark these as read
            </Button>
          )}

          <Link href="/notifications">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.5rem"
              }}
            >
              See all notifications
            </Button>
          </Link>
        </Box>
      </Menu>
    </div>
  );
});

export default NotificationsDropdown;
