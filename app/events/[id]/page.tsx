"use client";

// need to add metadata

import { useParams } from "next/navigation";
import eventsState, { EventType } from "../Events.state";
import { observer } from "mobx-react-lite";
import Event from "../Event";
import appState from "@/lib/AppState";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

const EventDetailPage = observer(() => {
  const params = useParams();
  const { id } = params;

  const eventInfo = eventsState.allEvents.find((e) => e.id === id);

  if (!eventInfo) {
    // todo: skeleton
    return <div>Event not found</div>;
  }

  console.log("eventsState ", eventsState);
  console.log("loggedInUser ", appState.loggedInUser);

  if (!eventsState.isInitialized) {
    return <div>Event Detail Page</div>;
  }

  return (
    <>
      <Typography variant="h1" sx={{ textAlign: "center" }}>
        {eventInfo.title}
      </Typography>
      <Event event={eventInfo as EventType} showTitle={false} />
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Link href="/events" passHref>
          <Button variant="contained">See all Events</Button>
        </Link>
      </Box>
    </>
  );
});

export default EventDetailPage;
