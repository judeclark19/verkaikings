import { Metadata } from "next";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import { fetchUsers } from "@/lib/serverUtils";
import UserListItem from "./UserListItem";

export const metadata: Metadata = {
  title: "People | Verkaikings"
};

export default async function PeoplePage() {
  const users = await fetchUsers();

  return (
    <div>
      <Typography variant="h1">List of People alphabetically</Typography>

      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper"
        }}
      >
        {users
          .sort(
            // Sort users alphabetically by username
            (a, b) => a.username.localeCompare(b.username)
          )
          .map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
      </List>
    </div>
  );
}
