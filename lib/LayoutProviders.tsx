"use client";

import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "@/styles/theme";
import { useEffect, useState } from "react";
import appState from "./AppState";
import { useSearchParams } from "next/navigation";
import SimpleSnackbar from "@/components/Snackbar";

export default function LayoutProviders({
  children,
  isLoggedIn,
  userId
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userId?: string;
}) {
  const searchParams = useSearchParams();
  const notifParam = searchParams.get("notif");

  useEffect(() => {
    appState.initializeSnapshots(isLoggedIn, userId);

    // Cleanup when the component unmounts or isLoggedIn changes
    return () => {
      appState.unsubscribeFromSnapshots();
    };
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (notifParam) {
      const element = document.getElementById(notifParam as string);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlighted");
        setTimeout(() => element.classList.remove("highlighted"), 1500); // Remove after 2s
      }
    }
  }, [notifParam]);

  return (
    <StyledComponentsRegistry>
      <GlobalStyles />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
        <SimpleSnackbar />
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
