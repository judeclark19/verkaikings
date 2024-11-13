"use client";

import { observer } from "mobx-react-lite";
import peopleState from "../People.state";
import { Typography } from "@mui/material";
import ByCity from "./ByCity";

const ByLocation = observer(() => {
  const countries = Object.keys(peopleState.usersByCountry);

  return (
    <div>
      <Typography variant="h1">List of users by country</Typography>

      {countries.map((countryAbbr) => {
        // putting "No city listed" at the end of the list
        const cityIds = Object.keys(
          peopleState.usersByCountry[countryAbbr].cities
        );
        const sortedCityIds = cityIds.filter((id) => id !== "No city listed");
        const noCityListedId = cityIds.includes("No city listed")
          ? ["No city listed"]
          : [];
        const orderedCityIds = [...sortedCityIds, ...noCityListedId];

        const countryName = peopleState.usersByCountry[countryAbbr].countryName;

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
  );
});

export default ByLocation;
