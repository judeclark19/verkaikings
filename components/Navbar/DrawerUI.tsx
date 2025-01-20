import {
  Badge,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import {
  eventsLink,
  homeLink,
  moreLinks,
  myProfileLink,
  peopleLinks
} from "./navLinks.data";
import DrawerLink from "./Links/DrawerLink";
import { useRouter, usePathname } from "next/navigation";
import {
  AppRegistration as AppRegistrationIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon
  // Event as EventIcon
} from "@mui/icons-material";
import { styled } from "styled-components";
import notificationsState from "@/app/notifications/Notifications.state";
import Link from "next/link";
import DrawerAccordion from "./Links/DrawerAccordion";

const ListStyle = styled(List)`
  a,
  .navLink {
    cursor: pointer;
    text-decoration: none;
    &:hover {
      background-color: "primary.main";
    }
  }
`;

function DrawerUI({
  isLoggedIn,
  handleDrawerToggle,
  handleLogout
}: {
  isLoggedIn: boolean;
  handleDrawerToggle: () => void;
  handleLogout: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <Box onClick={handleDrawerToggle}>
      <Typography variant="h3" sx={{ my: 2, ml: 2 }}>
        Verkaikings Society
      </Typography>
      <ListStyle>
        {/* HOME */}
        <DrawerLink link={homeLink} />

        {isLoggedIn && (
          <>
            {/* My Profile */}
            <DrawerLink link={myProfileLink} />

            {/* People */}
            <DrawerAccordion linkGroup={peopleLinks} />

            {/* More */}
            {/* <DrawerAccordion linkGroup={moreLinks} /> */}
            <DrawerLink link={eventsLink} />

            {/* NOTIFICATIONS */}
            <ListItem
              component={Link}
              href="/notifications"
              sx={{
                backgroundColor: isActive("/notifications")
                  ? "primary.main"
                  : "transparent",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.main"
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: "background.default",
                  minWidth: "40px"
                }}
              >
                {notificationsState.notifications.filter((notif) => !notif.read)
                  .length > 0 ? (
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
                  <NotificationsIcon />
                )}
              </ListItemIcon>

              <ListItemText
                primary="NOTIFICATIONS"
                primaryTypographyProps={{
                  fontWeight: isActive("/notifications") ? "700" : "400",
                  color: "background.default"
                }}
              />
            </ListItem>
          </>
        )}

        {/* link to /login */}
        <ListItem
          onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
          sx={{
            fontWeight: "inherit",
            backgroundColor: isActive("/login")
              ? "primary.main"
              : "transparent",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "primary.main"
            }
          }}
          className="navLink"
        >
          <ListItemIcon
            sx={{
              color: "background.default",
              minWidth: "40px"
            }}
          >
            {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>

          <ListItemText
            primary={isLoggedIn ? "LOG OUT" : "LOG IN"}
            primaryTypographyProps={{
              fontWeight: isActive("/login") ? "700" : "400"
            }}
          />
        </ListItem>

        {/* link to /signup */}

        {!isLoggedIn && (
          <ListItem
            component={Link}
            href="/signup"
            sx={{
              fontWeight: "inherit",
              color: "background.default",
              backgroundColor: isActive("/signup")
                ? "primary.dark"
                : "transparent"
            }}
          >
            <ListItemIcon
              sx={{
                color: "background.default",
                minWidth: "40px"
              }}
            >
              <AppRegistrationIcon />
            </ListItemIcon>

            <ListItemText
              primary="SIGN UP"
              primaryTypographyProps={{
                fontWeight: isActive("/signup") ? "700" : "400"
              }}
            />
          </ListItem>
        )}
      </ListStyle>
    </Box>
  );
}

export default DrawerUI;
