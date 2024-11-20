"use client";

import { Fragment, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box
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

const verticalDivider = (
  <Box
    sx={{
      height: "auto",
      width: "2px",
      backgroundColor: "text.secondary",
      margin: "0 16px"
    }}
  />
);

const NavbarUI = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
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

      // Force server-side navigation to ensure middleware checks the cookie
      window.location.href = "/"; // Triggers full page load
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => pathname === path;

  const getNavLinkStyle = (link: string) => {
    return {
      fontWeight: isActive(link) ? "700" : "400",
      backgroundColor: isActive(link) ? "primary.dark" : "transparent",
      "&:hover": {
        textDecoration: "underline"
      }
    };
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "primary.main",
          color: "text.secondary"
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
            sx={{ display: { m: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h3"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "block" },
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
                      {verticalDivider}
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
                      {link.title}
                    </Button>
                    {verticalDivider}
                  </Fragment>
                );
              })}
            <Button
              color="inherit"
              onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
              sx={getNavLinkStyle("/login")}
            >
              {isLoggedIn ? "Log Out" : "Log In"}
            </Button>
            {!isLoggedIn && (
              <>
                {verticalDivider}
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

              backgroundColor: "primary.main",
              color: "text.secondary"
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
};

export default NavbarUI;
