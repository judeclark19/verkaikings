"use client";

import { useParams } from "next/navigation";
import eventsState, { EventType } from "../Events.state";
import { observer } from "mobx-react-lite";
import Event from "../Event";
import appState from "@/lib/AppState";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import EditEventModal from "../EditEventModal";

const EventDetail = observer(() => {
  const params = useParams();
  const { id } = params;

  const eventInfo = eventsState.allEvents.find((e) => e.id === id);
  const isPast = eventsState.pastEvents.find((e) => e.id === id);

  if (!eventsState.isInitialized) {
    return (
      <div>
        <Typography variant="h1" sx={{ textAlign: "center" }}>
          <Skeleton />
        </Typography>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            height: 400,
            mt: 2
          }}
        />
      </div>
    );
  }

  if (!eventInfo) {
    return <div>Event with id {id} not found</div>;
  }

  document.title = `${eventInfo.title} | Willemijn's World Website`;

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
          flexDirection: "column",
          gap: 2,
          alignItems: "center"
        }}
      >
        {eventInfo.creatorId === appState.loggedInUser?.id && !isPast && (
          <EditEventModal buttonType="button" event={eventInfo as EventType} />
        )}

        <Link href="/events" passHref>
          <Button variant="contained">See all Events</Button>
        </Link>
      </Box>
    </>
  );
});

export default EventDetail;
