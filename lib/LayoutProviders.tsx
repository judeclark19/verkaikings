"use client";

import dayjs from "dayjs";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "@/styles/theme";
import { useEffect } from "react";
import appState from "./AppState";
import { useSearchParams } from "next/navigation";
import SimpleSnackbar from "@/components/Snackbar";
import { observer } from "mobx-react-lite";

export async function loadDayjsLocale(locale: string) {
  try {
    await import(`dayjs/locale/${locale}.js`);
    dayjs.locale(locale);
    return locale;
  } catch (err) {
    try {
      console.warn(err);
      const fallbackLocale = locale.toLowerCase().split("-")[0];
      await import(`dayjs/locale/${fallbackLocale}.js`);
      dayjs.locale(fallbackLocale);
      return fallbackLocale;
    } catch (fallbackErr) {
      console.warn(
        `Could not load dayjs locale "${locale}" or fallback. Using 'en'.`
      );
      console.warn(fallbackErr);
      dayjs.locale("en");
      return "en";
    }
  }
}

const LayoutProviders = observer(
  ({
    children,
    isLoggedIn,
    userId
  }: {
    children: React.ReactNode;
    isLoggedIn: boolean;
    userId?: string;
  }) => {
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
      loadDayjsLocale(appState.language).then((locale) => {
        appState.setDayJsLocale(locale);
      });
    }, [appState.language]);

    useEffect(() => {
      const scrollToElement = (startTime: number) => {
        if (notifParam) {
          const element = document.getElementById(notifParam as string);

          if (element) {
            // Check if the element is inside a Material UI Accordion
            const accordionContainer = element.closest(".MuiAccordion-root");
            if (
              accordionContainer &&
              !accordionContainer.classList.contains("Mui-expanded")
            ) {
              // Find the corresponding AccordionSummary element and click it to expand the accordion.
              const accordionSummary = accordionContainer.querySelector(
                ".MuiAccordionSummary-root"
              );
              if (accordionSummary) {
                accordionSummary.dispatchEvent(
                  new MouseEvent("click", { bubbles: true })
                );
                // Delay scrolling until after the accordion has time to expand
                setTimeout(() => {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                  });
                  element.classList.add("highlighted");
                  setTimeout(
                    () => element.classList.remove("highlighted"),
                    1500
                  );
                }, 300); // adjust delay (in ms) as needed
                return; // exit early to prevent immediate scrolling
              }
            }

            // If no accordion handling is required, scroll immediately
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("highlighted");
            setTimeout(() => element.classList.remove("highlighted"), 1500);
          } else {
            const elapsedTime = performance.now() - startTime;
            if (elapsedTime < 8000) {
              // Retry for up to 8 seconds if the element hasn't been rendered yet.
              requestAnimationFrame(() => scrollToElement(startTime));
            } else {
              console.warn(
                `Element with id ${notifParam} not found after 8 seconds.`
              );
            }
          }
        }
      };

      if (notifParam) {
        const startTime = performance.now();
        scrollToElement(startTime);
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
);

export default LayoutProviders;
