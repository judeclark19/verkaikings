"use client";

import { List, Skeleton, Typography } from "@mui/material";
import UserListItem from "./UserListItem";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";

const ByName = observer(() => {
  return (
    <div>
      <Typography variant="h1">List of People alphabetically</Typography>
      {appState.users && appState.isInitialized ? (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper"
          }}
        >
          {appState.users
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
