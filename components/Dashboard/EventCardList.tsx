import { EventDocType } from "@/app/events/Events.state";
import appState from "@/lib/AppState";
import {
  Typography,
  Link as MuiLink,
  CircularProgress,
  Box
} from "@mui/material";
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
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
        </Box>
      </>
    );
  }
);

export default EventCardList;
