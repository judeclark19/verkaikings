"use client";

import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import { Skeleton, Typography } from "@mui/material";
import ByCity from "./ByCity";
import userList from "@/lib/UserList";

const ByLocation = observer(() => {
  const countries = Object.keys(userList.usersByCountry);

  return (
    <>
      <Typography variant="h1">List of users by country</Typography>
      {appState.isInitialized ? (
        <div>
          {countries.map((countryAbbr) => {
            // putting "No city listed" at the end of the list
            const cityIds = Object.keys(
              userList.usersByCountry[countryAbbr].cities
            );
            const sortedCityIds = cityIds.filter(
              (id) => id !== "No city listed"
            );
            const noCityListedId = cityIds.includes("No city listed")
              ? ["No city listed"]
              : [];
            const orderedCityIds = [...sortedCityIds, ...noCityListedId];

            const countryName =
              userList.usersByCountry[countryAbbr].countryName;

            return (
              <div key={countryAbbr}>
                <Typography variant="h2">{countryName}</Typography>
                {orderedCityIds.map((cityId) => {
                  return (
                    <ByCity
                      key={cityId}
                      countryAbbr={countryAbbr}
                      cityId={cityId}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          width="360px"
          height="70vh"
          sx={{ borderRadius: 1 }}
        />
      )}
    </>
  );
});

export default ByLocation;
