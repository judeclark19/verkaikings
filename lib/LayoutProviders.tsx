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
import userList from "./UserList";
import { toJS } from "mobx";

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
          appState.init(users, userId!).then(() => {
            // Now appState is initialized, cityNames and countryNames should be ready
            unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
              const updatedUsers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
              }));

              userList.setUsers(
                updatedUsers,
                appState.cityNames,
                appState.countryNames
              );
            });
          });
        });
      } else {
        // If already initialized, attach snapshot right away
        unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
          const updatedUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          userList.setUsers(
            updatedUsers,
            appState.cityNames,
            appState.countryNames
          );
        });
      }
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
