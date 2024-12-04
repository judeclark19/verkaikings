"use client";

import { Alert, List, Skeleton, Typography } from "@mui/material";
import UserListItem from "./UserListItem";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import { useEffect, useState } from "react";
import userList from "@/lib/UserList";
import { toJS } from "mobx";

const ByName = observer(() => {
  return (
    <div>
      <Typography variant="h1">List of People alphabetically</Typography>

      {appState.isInitialized && userList.filteredUsers.length === 0 && (
        <Alert
          sx={{
            mt: 2
          }}
          severity="info"
        >
          No users found with the search query: &ldquo;{userList.query}&rdquo;.
        </Alert>
      )}

      {userList.users.length && appState.isInitialized ? (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            display: userList.filteredUsers.length ? "block" : "none"
          }}
        >
          {userList.filteredUsers
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
