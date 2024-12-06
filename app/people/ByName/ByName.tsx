"use client";

import { Alert, List, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import ByLetter from "./ByLetter";

const ByName = observer(() => {
  const groupedUsers = userList.filteredUsers
    .slice()
    .sort((a, b) => a.username.localeCompare(b.username)) // Sort alphabetically
    .reduce((groups, user) => {
      const firstLetter = user.username[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(user);
      return groups;
    }, {} as Record<string, typeof userList.filteredUsers>);

  if (!appState.isInitialized) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100vh"
        sx={{
          borderRadius: 1,
          maxWidth: "100%"
        }}
      />
    );
  }

  return (
    <div>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        List of People Alphabetically
      </Typography>

      {userList.filteredUsers.length > 0 ? (
        <List
          sx={{
            width: "100%",
            py: 0,
            display: "grid",

            gridTemplateColumns: {
              sx: "repeat(auto-fill,  1fr)",
              sm: "repeat(auto-fill, minmax(300px, 1fr))"
            },

            gap: 1
          }}
        >
          {Object.keys(groupedUsers).map((letter) => (
            <ByLetter
              key={letter}
              letter={letter}
              groupedUsers={groupedUsers}
            />
          ))}
        </List>
      ) : (
        <Alert
          sx={{
            mt: 2
          }}
          severity="info"
        >
          No users found with the search query: &ldquo;{userList.query}&rdquo;.
        </Alert>
      )}
    </div>
  );
});

export default ByName;
