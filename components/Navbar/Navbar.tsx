"use client";

import { useEffect, useState } from "react";
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
  styled,
  ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import { navLinks } from "./navLinks";
import { auth, authListener } from "@/lib/firebase"; // Import from firebase.ts
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";

const ListStyle = styled(List)`
  a {
    color: white;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Store auth state
  const [loading, setLoading] = useState(true); // Loading state while checking auth
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Use the authListener to listen for auth state changes
    authListener((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false); // Stop loading after auth state is checked
    });
  }, []); // Runs only on mount

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
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Verkaikings
      </Typography>
      <ListStyle>
        {navLinks.map((link) => (
          <ListItem
            key={link.href}
            component={Link}
            href={link.href}
            sx={{ fontWeight: "inherit" }}
          >
            {link.icon && (
              <ListItemIcon>
                <link.icon />
              </ListItemIcon>
            )}
            <ListItemText
              primary={link.title}
              primaryTypographyProps={{
                fontWeight: isActive(link.href) ? "700" : "400"
              }}
            />
          </ListItem>
        ))}
        {!loading && (
          <ListItem
            onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
            sx={{ fontWeight: "inherit" }}
          >
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText
              primary={isLoggedIn ? "Log Out" : "Log In"}
              primaryTypographyProps={{
                fontWeight: isActive("/login") ? "700" : "400"
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
        <Toolbar>
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
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navLinks.map((link) => (
              <Button
                key={link.href}
                color="inherit"
                component={Link}
                href={link.href}
                sx={{ fontWeight: isActive(link.href) ? "700" : "400" }}
              >
                {link.title}
              </Button>
            ))}
            {!loading && (
              <Button
                color="inherit"
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                sx={{ fontWeight: isActive("/login") ? "700" : "400" }}
              >
                {isLoggedIn ? "Log Out" : "Log In"}
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
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
