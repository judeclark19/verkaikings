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
            color: "primary.dark",
            textAlign: "center"
          }}
        >
          Upcoming Events
        </Typography>

        {eventsState.upcomingEvents.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              mb: 3
            }}
          >
            No upcoming events
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2
            }}
          >
            {eventsState.upcomingEvents.map((event) => (
              <Event key={event.id} event={event as EventType} />
            ))}
          </Box>
        )}

        {eventsState.pastEvents.length > 0 && (
          <>
            <Typography
              variant="h2"
              textAlign="center"
              sx={{
                color: "primary.dark",
                mt: 5,
                mb: 1
              }}
            >
              Past Events
            </Typography>
            <Typography
              sx={{
                mb: 3,
                textAlign: "center"
              }}
            >
              Events in the past cannot be edited.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2
              }}
            >
              {eventsState.pastEvents.map((event) => (
                <Event key={event.id} event={event as EventType} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
});

export default EventsList;
