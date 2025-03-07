"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  Divider,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  // eventsLink,
  homeLink,
  moreLinks,
  myProfileLink,
  peopleLinks
} from "./navLinks.data";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import DrawerUI from "./DrawerUI";
import { observer } from "mobx-react-lite";
import myProfileState from "@/app/profile/MyProfile.state";
import NotificationsDropdown from "./Notifications/NotificationsDropdown";
import notificationsState from "@/app/notifications/Notifications.state";
import AppBarLink from "./Links/AppBarLink";
import SubmenuDropdown from "./Links/SubmenuDropdown";

const NavbarUI = observer(
  ({ isLoggedIn }: { isLoggedIn: boolean; userId?: string }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
      try {
        await signOut(auth); // Log out the user
        // Remove the authToken from cookies
        Cookies.remove("authToken");
        myProfileState.signOut(); // Reset the user profile state

        // Force server-side navigation to ensure middleware checks the cookie
        window.location.href = "/"; // Triggers full page load
      } catch (error) {
        alert(`Error logging out: ${error}`);
        console.error("Error logging out:", error);
      }
    };

    const isActive = (path: string) => {
      if (path === "/profile") {
        return pathname === path;
      }
      return pathname.startsWith(path) && (path !== "/" || pathname === "/");
    };

    const getNavLinkStyle = (link: string) => {
      return {
        fontWeight: isActive(link) ? "700" : "500",
        backgroundColor: isActive(link) ? "primary.main" : "transparent",
        "&:hover": {
          backgroundColor: "primary.main"
        }
      };
    };

    return (
      <>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "primary.dark",
            color: "background.default"
          }}
        >
          <Toolbar
            sx={{
              width: "1400px",
              maxWidth: "100%",
              margin: "auto"
            }}
          >
            {/* hamburger */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, mr: 2 }}
            >
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
                <MenuIcon />
              </Badge>
            </IconButton>
            {/* logo */}
            <Typography
              variant="h3"
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                display: "block",
                textAlign: { xs: "right", md: "left" },
                color: "inherit",
                textDecoration: "none"
              }}
            >
              Verkaikings Society
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "flex" }
              }}
            >
              {/* HOME */}
              <AppBarLink link={homeLink} isActive={isActive(homeLink.href)} />

              {isLoggedIn && (
                <>
                  {/* MY PROFILE */}
                  <AppBarLink
                    link={myProfileLink}
                    isActive={isActive(myProfileLink.href)}
                  />

                  {/* PEOPLE */}
                  <SubmenuDropdown linkGroup={peopleLinks} />
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "background.default",
                      margin: "0 8px"
                    }}
                  />

                  <SubmenuDropdown linkGroup={moreLinks} />
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "background.default",
                      margin: "0 8px"
                    }}
                  />

                  {/* EVENTS */}
                  {/* <AppBarLink
                    link={eventsLink}
                    isActive={isActive(eventsLink.href)}
                  /> */}

                  {/* NOTIFICATIONS */}
                  <NotificationsDropdown />
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "background.default",
                      margin: "0 8px"
                    }}
                  />
                </>
              )}

              {/* LOG IN / LOG OUT */}
              <Button
                color="inherit"
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                sx={getNavLinkStyle("/login")}
              >
                {isLoggedIn ? "Log Out" : "Log In"}
              </Button>

              {/* SIGN UP */}
              {!isLoggedIn && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "background.default",
                      margin: "0 8px"
                    }}
                  />
                  <Button
                    color="inherit"
                    component={Link}
                    href="/signup"
                    sx={getNavLinkStyle("/signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,

                backgroundColor: "primary.dark",
                color: "background.default"
              }
            }}
          >
            <DrawerUI
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              handleDrawerToggle={handleDrawerToggle}
            />
          </Drawer>
        </Box>
      </>
    );
  }
);

export default NavbarUI;
