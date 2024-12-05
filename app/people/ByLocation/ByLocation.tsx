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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            width: "100%"
          }}
        >
          {countries.map((countryAbbr) => (
            <ByCountry key={countryAbbr} countryAbbr={countryAbbr} />
          ))}
        </Box>
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
