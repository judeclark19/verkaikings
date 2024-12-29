import { Typography } from "@mui/material";
import { Metadata } from "next";
import EventsList from "./EventsList";

export const metadata: Metadata = {
  title: "Events | Willemijn's World Website"
};

const EventsPage = () => {
  return (
    <div>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Events
      </Typography>
      <EventsList />
    </div>
  );
};

export default EventsPage;
