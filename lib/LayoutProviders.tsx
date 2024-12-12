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
    let unsubscribeUsers: (() => void) | null = null;
    let unsubscribeStories: (() => void) | null = null;

    // Fetch users from Firestore
    async function fetchUsers() {
      const users = await getDocs(collection(db, "users"));
      return users.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    // Fetch myWillemijnStories from Firestore
    async function fetchMWStories() {
      const stories = await getDocs(collection(db, "myWillemijnStories"));
      return stories.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    if (isLoggedIn) {
      if (!appState.isInitialized) {
        Promise.all([fetchUsers(), fetchMWStories()])
          .then(([users, stories]) => {
            appState.init(users, userId!, stories);
          })
          .catch((error) => {
            console.error("Error during appState initialization:", error);
          });
      }

      // Add snapshot listeners to keep data in sync
      unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        appState.userList.setUsers(updatedUsers);
      });

      unsubscribeStories = onSnapshot(
        collection(db, "myWillemijnStories"),
        (snapshot) => {
          const updatedStories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          appState.myWillemijnStories.setAllStories(updatedStories);
          appState.myWillemijnStories.updateFilteredStories();
        }
      );
    }

    // Cleanup on unmount or when isLoggedIn changes to false
    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeStories) unsubscribeStories();
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
