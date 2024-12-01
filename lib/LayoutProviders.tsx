"use client";

import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "@/styles/theme";
import { useEffect } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import appState from "./AppState";

export default function LayoutProviders({
  children,
  isLoggedIn,
  userId
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userId?: string;
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
      if (!appState.isInitialized) {
        fetchUsers().then((users) => {
          appState.init(users, userId!);
        });
      }

      // Add snapshot listener to keep user data in sync
      unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        appState.setUsers(updatedUsers); // Update appState
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
