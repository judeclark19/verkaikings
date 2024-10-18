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
  styled,
  ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";

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
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Dummy authentication check for example
  const isLoggedIn = false; // Replace with actual auth logic
  const isActive = (path: string) => pathname === path;

  // Drawer content for mobile view
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Verkaikings
      </Typography>
      <ListStyle>
        <ListItem component={Link} href="/" sx={{ fontWeight: "inherit" }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{
              fontWeight: isActive("/") ? "700" : "400"
            }}
          />
        </ListItem>

        <ListItem
          component={Link}
          href="/people"
          sx={{ fontWeight: "inherit" }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            primary="People"
            primaryTypographyProps={{
              fontWeight: isActive("/people") ? "700" : "400"
            }}
          />
        </ListItem>

        <ListItem
          component={Link}
          href="/profile"
          sx={{ fontWeight: "inherit" }}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary="My Profile"
            primaryTypographyProps={{
              fontWeight: isActive("/profile") ? "700" : "400"
            }}
          />
        </ListItem>

        <ListItem
          onClick={() => router.push(isLoggedIn ? "/logout" : "/login")}
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
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Verkaikings
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              color="inherit"
              component={Link}
              href="/"
              sx={{ fontWeight: isActive("/") ? "700" : "400" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/people"
              sx={{ fontWeight: isActive("/people") ? "700" : "400" }}
            >
              People
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/profile"
              sx={{ fontWeight: isActive("/profile") ? "700" : "400" }}
            >
              My Profile
            </Button>
            <Button
              color="inherit"
              onClick={() => router.push(isLoggedIn ? "/logout" : "/login")}
              sx={{ fontWeight: isActive("/login") ? "700" : "400" }}
            >
              {isLoggedIn ? "Log Out" : "Log In"}
            </Button>
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
