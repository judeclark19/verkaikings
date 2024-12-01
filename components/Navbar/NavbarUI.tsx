"use client";

import { Fragment, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  Divider,
  Avatar,
  CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { navLinks } from "./navLinks";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import SubmenuDropdown from "./SubmenuDropdown";
import DrawerUI from "./DrawerUI";
import { observer } from "mobx-react-lite";
import myProfileState from "@/app/profile/MyProfile.state";

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
        console.error("Error logging out:", error);
      }
    };

    const isActive = (path: string) => pathname === path;

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
          position="static"
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
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
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
              Willemijn&apos;s World
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "flex" }
              }}
            >
              {navLinks
                .filter((link) => {
                  if (link.protected) {
                    return isLoggedIn;
                  }
                  return true;
                })
                .map((link) => {
                  if (link.submenu)
                    return (
                      <Fragment key={link.title}>
                        <SubmenuDropdown parentLink={link} />
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            borderColor: "background.default",
                            margin: "0 8px"
                          }}
                        />
                      </Fragment>
                    );
                  return (
                    <Fragment key={link.href}>
                      <Button
                        color="inherit"
                        component={Link}
                        href={link.href}
                        sx={getNavLinkStyle(link.href)}
                      >
                        {link.title === "My Profile" && myProfileState.user ? (
                          <>
                            <Avatar
                              src={myProfileState.user.profilePicture || ""}
                              alt={`${myProfileState.user.firstName} ${myProfileState.user.lastName}`}
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: 12,
                                bgcolor: "secondary.main"
                              }}
                            >
                              {!myProfileState.user.profilePicture &&
                                `${myProfileState.user.firstName?.[0] || ""}${
                                  myProfileState.user.lastName?.[0] || ""
                                }`}
                            </Avatar>
                          </>
                        ) : link.title === "Profile" ? (
                          <CircularProgress
                            size={28}
                            sx={{
                              color: "background.default"
                            }}
                          />
                        ) : (
                          link.title
                        )}
                      </Button>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          borderColor: "background.default",
                          margin: "0 8px"
                        }}
                      />
                    </Fragment>
                  );
                })}
              <Button
                color="inherit"
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                sx={getNavLinkStyle("/login")}
              >
                {isLoggedIn ? "Log Out" : "Log In"}
              </Button>
              {!isLoggedIn && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "background.default"
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
