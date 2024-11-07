"use client";

import { DocumentData } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import demographicsState from "./Demographics.state";
import { fetchCityName } from "@/lib/clientUtils";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Skeleton
} from "@mui/material";
import Link from "next/link";
import UserListItem from "./UserListItem";

const DemographicsUI = observer(({ users }: { users: DocumentData[] }) => {
  const [cityNames, setCityNames] = useState<Record<string, string>>({});

  useEffect(() => {
    demographicsState.init(users);

    const fetchCityNames = async () => {
      for (const user of users) {
        if (!cityNames[user.cityId]) {
          try {
            const cityName = await fetchCityName(user.cityId);
            setCityNames((prev) => ({
              ...prev,
              [user.cityId]: cityName
            }));
          } catch (error) {
            console.error(
              `Failed to fetch city name for ${user.cityId}:`,
              error
            );
          }
        }
      }
    };

    fetchCityNames();
  }, [users]);

  return (
    <div>
      <Typography variant="h1">List of users by country</Typography>

      {Object.keys(demographicsState.usersByCountry).map((countryAbbr) => {
        return (
          <div key={countryAbbr}>
            <Typography variant="h2">
              {demographicsState.usersByCountry[countryAbbr].countryName}
            </Typography>
            {Object.keys(
              demographicsState.usersByCountry[countryAbbr].cities
            ).map((cityId) => {
              return (
                <div key={cityId}>
                  <Typography variant="h3">
                    {cityNames[cityId] ? cityNames[cityId] : <Skeleton />}
                  </Typography>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper"
                    }}
                  >
                    {demographicsState.usersByCountry[countryAbbr].cities[
                      cityId
                    ].map((user) => {
                      return <UserListItem key={user.id} user={user} />;
                    })}
                  </List>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

export default DemographicsUI;
