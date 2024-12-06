"use client";

import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import { Box, Skeleton, Typography } from "@mui/material";
import userList from "@/lib/UserList";
import ByCountry from "./ByCountry";

const ByLocation = observer(() => {
  // Sort countries by user count
  const countries = Object.keys(userList.usersByCountry)
    .map((countryAbbr) => ({
      countryAbbr,
      userCount: Object.values(
        userList.usersByCountry[countryAbbr].cities
      ).reduce((count, users) => count + users.length, 0)
    }))
    .sort((a, b) => b.userCount - a.userCount)
    .map((item) => item.countryAbbr);

  const leftColumn: string[] = [];
  const rightColumn: string[] = [];

  countries.forEach((countryAbbr, i) => {
    if (i % 2 === 0) {
      leftColumn.push(countryAbbr);
    } else {
      rightColumn.push(countryAbbr);
    }
  });

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        List of users by country and city
      </Typography>
      {appState.isInitialized ? (
        <div
          style={{
            maxWidth: "1016px",
            margin: "auto"
          }}
        >
          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none"
              },
              flexDirection: "column",
              gap: 2,
              alignItems: "center"
            }}
          >
            {/* SINGLE COLUMN VIEW */}
            {countries.map((countryAbbr, i) => (
              <ByCountry
                key={countryAbbr}
                countryAbbr={countryAbbr}
                titleColor={i % 2 === 0 ? "primary.dark" : "secondary.dark"}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex"
              },
              gap: 2
            }}
          >
            {/* TWO COLUMN VIEW */}
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2
              }}
            >
              {leftColumn.map((countryAbbr, i) => (
                <ByCountry
                  key={countryAbbr}
                  countryAbbr={countryAbbr}
                  titleColor={i % 2 === 0 ? "primary.dark" : "secondary.dark"}
                />
              ))}
            </Box>

            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2
              }}
            >
              {rightColumn.map((countryAbbr, i) => (
                <ByCountry
                  key={countryAbbr}
                  countryAbbr={countryAbbr}
                  titleColor={i % 2 === 0 ? "primary.dark" : "secondary.dark"}
                />
              ))}
            </Box>
          </Box>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          width="1016px"
          sx={{
            margin: "auto",
            maxWidth: "100%",
            borderRadius: 1,
            height: {
              xs: "650px",
              md: "350px"
            }
          }}
        />
      )}
    </>
  );
});

export default ByLocation;
