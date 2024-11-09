"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppRegistration } from "@mui/icons-material";
import { navLinks } from "./navLinks";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import SubmenuDropdown from "./SubmenuDropdown";
import DrawerLink from "./DrawerLink";
import { styled } from "styled-components";

const ListStyle = styled(List)`
  a,
  .navLink {
    color: white;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const WhiteLine = styled.li`
  position: relative;

  a {
    padding-left: 0;
  }

  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: white;
    margin-right: 8px;
    left: -24px;
  }
`;

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

  // Drawer content for mobile view
  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Verkaikings
      </Typography>
      <ListStyle>
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
                <div key={link.title}>
                  <ul style={{ paddingLeft: "52px", listStyle: "none" }}>
                    <li style={{ textAlign: "left", position: "relative" }}>
                      <Box
                        component="span"
                        sx={{
                          position: "absolute",
                          left: "-30px",
                          top: "6px",
                          width: "12px",
                          height: "12px",
                          border: "2px solid white",
                          borderRadius: "50%"
                        }}
                      />
                      {link.title}
                      <ul style={{ padding: "0", listStyle: "none" }}>
                        {link.submenu.map((submenuLink) => (
                          <WhiteLine key={submenuLink.href}>
                            <DrawerLink link={submenuLink} />
                          </WhiteLine>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>
              );
            else return <DrawerLink key={link.href} link={link} />;
          })}

        <ListItem
          onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
          sx={{ fontWeight: "inherit" }}
          className="navLink"
        >
          <ListItemIcon>
            {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>

          <ListItemText
            primary={isLoggedIn ? "Log Out" : "Log In"}
            primaryTypographyProps={{
              fontWeight: isActive("/login") ? "700" : "400"
            }}
          />
        </ListItem>

        {!isLoggedIn && (
          <ListItem
            component={Link}
            href="/signup"
            sx={{ fontWeight: "inherit" }}
          >
            <ListItemIcon>
              <AppRegistration />
            </ListItemIcon>

            <ListItemText
              primary="Sign Up"
              primaryTypographyProps={{
                fontWeight: isActive("/signup") ? "700" : "400"
              }}
            />
          </ListItem>
        )}
      </ListStyle>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
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
            sx={{ display: { sm: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              color: "inherit",
              textDecoration: "none"
            }}
          >
            Verkaikings
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navLinks
              .filter((link) => {
                if (link.protected) {
                  return isLoggedIn;
                }
                return true;
              })
              .map((link) => {
                if (link.submenu)
                  return <SubmenuDropdown key={link.title} parentLink={link} />;
                return (
                  <Button
                    key={link.href}
                    color="inherit"
                    component={Link}
                    href={link.href}
                    sx={{
                      fontWeight: isActive(link.href) ? "700" : "400",
                      textDecoration: isActive(link.href) ? "underline" : "none"
                    }}
                  >
                    {link.title}
                  </Button>
                );
              })}
            <Button
              color="inherit"
              onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
              sx={{
                fontWeight: isActive("/login") ? "700" : "400",
                textDecoration: isActive("/login") ? "underline" : "none"
              }}
            >
              {isLoggedIn ? "Log Out" : "Log In"}
            </Button>
            {!isLoggedIn && (
              <Button
                color="inherit"
                component={Link}
                href="/signup"
                sx={{
                  fontWeight: isActive("/signup") ? "700" : "400",
                  textDecoration: isActive("/signup") ? "underline" : "none"
                }}
              >
                Sign Up
              </Button>
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
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 }
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default NavbarUI;
