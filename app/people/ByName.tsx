"use client";

import { List, Skeleton, Typography } from "@mui/material";
import UserListItem from "./UserListItem";
import { observer } from "mobx-react-lite";
import peopleState from "./People.state";
import placeDataCache from "@/lib/PlaceDataCache";

const ByName = observer(() => {
  return (
    <div>
      <Typography variant="h1">List of People alphabetically</Typography>
      {peopleState.isFetched ? (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper"
          }}
        >
          {placeDataCache.users
            .slice()
            .sort(
              // Sort users alphabetically by username
              (a, b) => a.username.localeCompare(b.username)
            )
            .map((user) => (
              <UserListItem key={user.username} user={user} />
            ))}
        </List>
      ) : (
        <Skeleton
          variant="rectangular"
          width="360px"
          height="70vh"
          sx={{ borderRadius: 1 }}
        />
      )}
    </div>
  );
});

export default ByName;
