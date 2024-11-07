import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { DocumentData } from "firebase-admin/firestore";
import Link from "next/link";
import React from "react";

function UserListItem({ user }: { user: DocumentData }) {
  return (
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
        <ListItemText primary={`${user.firstName} ${user.lastName}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default UserListItem;
