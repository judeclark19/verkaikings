"use client";

import { observer } from "mobx-react-lite";
import eventsState, { EventType } from "./Events.state";
import Event from "./Event";
import { Box, Skeleton, Typography } from "@mui/material";
import NewEventModal from "./NewEventModal";

const EventsList = observer(() => {
  if (!eventsState.isInitialized) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          marginBottom: "2rem"
        }}
      >
        <Typography>
          {eventsState.allEvents.length === 0
            ? "No events yet"
            : "Don't see your event below?"}
        </Typography>
        <NewEventModal />
      </Box>

      <Box
        sx={{
          width: "100%",
          margin: "0 auto"
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "primary.dark"
          }}
        >
          Upcoming Events
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {eventsState.upcomingEvents.map((event) => (
            <Event key={event.title} event={event as EventType} />
          ))}
        </Box>
        <Typography
          variant="h2"
          sx={{
            color: "primary.dark"
          }}
        >
          Past Events
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {eventsState.pastEvents.map((event) => (
            <Event key={event.title} event={event as EventType} />
          ))}
        </Box>
      </Box>
    </>
  );
});

export default EventsList;
