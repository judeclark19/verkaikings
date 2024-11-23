"use client";

import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles"; // Import ThemeProvider
import CssBaseline from "@mui/material/CssBaseline"; // Import CssBaseline
import darkTheme from "@/styles/theme"; // Import your dark theme
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import placeDataCache from "./PlaceDataCache";

export default function LayoutProviders({
  children,
  isLoggedIn
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) {
  useEffect(() => {
    async function fetchUsers() {
      const users = await getDocs(collection(db, "users"));
      return users.docs.map((doc) => doc.data());
    }

    if (isLoggedIn && !placeDataCache.isInitialized) {
      fetchUsers().then((users) => {
        placeDataCache.init(users);
      });
    }
  }, []);

  return (
    <StyledComponentsRegistry>
      <GlobalStyles />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline /> {/* Applies Material UI baseline styles */}
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
