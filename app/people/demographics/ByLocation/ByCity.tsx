import { List, Skeleton, Typography } from "@mui/material";
import React from "react";
import UserListItem from "../../UserListItem";
import { observer } from "mobx-react-lite";
import peopleState from "../../People.state";

const ByCity = observer(
  ({
    cityNames,
    countryAbbr,
    cityId
  }: {
    cityNames: Record<string, string>;
    countryAbbr: string;
    cityId: string;
  }) => {
    return (
      <div
        key={cityId}
        style={{
          marginLeft: "2rem"
        }}
      >
        <Typography variant="h3">
          {cityId === "No city listed" ? (
            "No city listed"
          ) : cityNames[cityId] ? (
            cityNames[cityId]
          ) : (
            <Skeleton />
          )}
        </Typography>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper"
          }}
        >
          {peopleState.usersByCountry[countryAbbr].cities[cityId].map(
            (user) => {
              return <UserListItem key={user.id} user={user} />;
            }
          )}
        </List>
      </div>
    );
  }
);

export default ByCity;
