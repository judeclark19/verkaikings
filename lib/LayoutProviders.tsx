"use client";

import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "@/styles/theme";
import { useEffect } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
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
    let unsubscribe: (() => void) | null = null;

    // Initialize user data on login
    async function fetchUsers() {
      const users = await getDocs(collection(db, "users"));
      return users.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    if (isLoggedIn) {
      if (!placeDataCache.isInitialized) {
        fetchUsers().then((users) => {
          placeDataCache.init(users);
        });
      }

      // Add snapshot listener to keep user data in sync
      unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        placeDataCache.setUsers(updatedUsers); // Update PlaceDataCache
      });
    }

    // Cleanup on unmount or when isLoggedIn changes to false
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn]);

  return (
    <StyledComponentsRegistry>
      <GlobalStyles />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
