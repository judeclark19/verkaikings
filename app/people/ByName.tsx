"use client";

import {
  Alert,
  List,
  ListSubheader,
  Skeleton,
  Typography
} from "@mui/material";
import UserListItem from "./UserListItem";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import { DocumentData } from "firebase/firestore";

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

  return (
    <div>
      <Typography variant="h1">List of People Alphabetically</Typography>

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
            py: 0
          }}
        >
          {Object.keys(groupedUsers).map((letter) => (
            <li key={letter}>
              <ul
                style={{
                  padding: 0
                }}
              >
                <ListSubheader
                  sx={{
                    backgroundColor: "background.default"
                  }}
                >
                  {letter}
                </ListSubheader>
                {groupedUsers[letter].map((user: DocumentData) => (
                  <UserListItem key={user.username} user={user} />
                ))}
              </ul>
            </li>
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
