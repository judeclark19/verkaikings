// app/people/page.tsx

import { Metadata } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "People | Verkaikings"
};

async function fetchUsers() {
  const snapshot = await adminDb.collection("users").get();
  const users: DocumentData[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  return users;
}

export default async function PeoplePage() {
  const users = await fetchUsers();

  return (
    <div>
      <Typography variant="h1">List of People</Typography>
      <ul>
        {users.map((user) => (
          <List
            key={user.id}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              margin: "auto"
            }}
          >
            <ListItem
              component={Link}
              href={`/profile/${user.username}`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)"
                }
              }}
            >
              <ListItemText primary={user.username} />
            </ListItem>
          </List>
        ))}
      </ul>
    </div>
  );
}
