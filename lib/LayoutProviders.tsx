"use client";

import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles"; // Import ThemeProvider
import CssBaseline from "@mui/material/CssBaseline"; // Import CssBaseline
import darkTheme from "@/styles/theme"; // Import your dark theme

export default function LayoutProviders({
  children
}: {
  children: React.ReactNode;
}) {
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
