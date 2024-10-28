import { Metadata } from "next";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import { fetchUsers } from "@/lib/utils";

export const metadata: Metadata = {
  title: "People | Verkaikings"
};

export default async function PeoplePage() {
  const users = await fetchUsers();

  return (
    <div>
      <Typography variant="h1">List of People</Typography>

      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          margin: "auto"
        }}
      >
        {users
          .sort(
            // Sort users alphabetically by username
            (a, b) => a.username.localeCompare(b.username)
          )
          .map((user) => (
            <ListItem
              key={user.id}
              disablePadding
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)"
                }
              }}
            >
              <ListItemButton
                component={Link}
                href={`/profile/${user.username}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%"
                }}
              >
                <ListItemText primary={user.username} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );
}
