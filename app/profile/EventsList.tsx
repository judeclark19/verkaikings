"use client";

import appState from "@/lib/AppState";
import {
  List,
  Typography,
  Link as MuiLink,
  Paper,
  Divider
} from "@mui/material";
import { observer } from "mobx-react-lite";
import myProfileState from "./MyProfile.state";
import eventsState from "../events/Events.state";
import Link from "next/link";
import { DocumentData } from "firebase/firestore";

const EventsList = observer(({ user }: { user: DocumentData }) => {
  const isSelf = user.id === myProfileState.userId;
  const userEvents = eventsState.upcomingEvents.filter((event) =>
    event.attendees.includes(user.id)
  );

  if (!user || userEvents.length === 0) {
    return null;
  }
  return (
    <>
      <Divider
        sx={{
          my: 3
        }}
      />
      <Paper elevation={6} sx={{ padding: 3 }}>
        <Typography variant="h3" sx={{ textAlign: "center", marginTop: 0 }}>
          Events
        </Typography>
        <Typography variant="h4">
          {isSelf ? "You" : user.firstName} {isSelf ? "are" : "is"} attending
          the following upcoming events:
        </Typography>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 0
          }}
        >
          {userEvents.map((event) => (
            <MuiLink
              key={event.id}
              component={Link}
              href={`/events/${event.id}`}
            >
              {event.title}
            </MuiLink>
          ))}
        </List>
      </Paper>
    </>
  );
});

export default EventsList;
