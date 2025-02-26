import { EventDocType } from "@/app/events/Events.state";
import appState from "@/lib/AppState";
import { Typography, Link as MuiLink, CircularProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const EventCardList = observer(
  ({
    events,
    emptyMessage
  }: {
    events: EventDocType[];
    emptyMessage: string;
  }) => {
    if (!appState.isInitialized) {
      return <CircularProgress />;
    }

    return (
      <>
        {events.length === 0 && (
          <Typography
            sx={{
              color: "text.secondary"
            }}
          >
            {emptyMessage}
          </Typography>
        )}
        {events.length > 0 &&
          events.map((event) => (
            <MuiLink
              key={event.id}
              component={Link}
              href={`/events/${event.id}`}
            >
              {event.title}
            </MuiLink>
          ))}
      </>
    );
  }
);

export default EventCardList;
