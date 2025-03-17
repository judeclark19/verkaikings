import { Button, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import eventsState, { EventDocType } from "@/app/events/Events.state";
import Link from "next/link";
import { Event as EventIcon } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import EventCardList from "./EventCardList";

const EventsDashboard = observer(() => {
  const [recentEvents, setRecentEvents] = useState<EventDocType[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<EventDocType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDocType[]>([]);

  useEffect(() => {
    const recentEvents: EventDocType[] = [];
    const todayEvents: EventDocType[] = [];
    const upcomingEvents: EventDocType[] = [];

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA");

    const pastMonth = new Date();
    pastMonth.setDate(today.getDate() - 30); // 30 days ago

    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30); // 30 days ahead

    eventsState.allEvents.forEach((event) => {
      const eventDate = new Date(event.date);

      if (event.date === todayStr) {
        todayEvents.unshift(event);
      } else if (eventDate >= pastMonth && eventDate < today) {
        recentEvents.push(event);
      } else if (eventDate > today && eventDate <= nextMonth) {
        upcomingEvents.unshift(event);
      }
    });

    setRecentEvents(recentEvents);
    setTodaysEvents(todayEvents);
    setUpcomingEvents(upcomingEvents);
  }, [eventsState.allEvents]);
  return (
    <>
      {/* EVENTS */}
      <Paper
        sx={{
          p: 2,
          gap: 2,
          justifyContent: "center",
          width: "100%",
          maxWidth: "1000px",
          margin: "auto",
          display: "grid",

          gridTemplateAreas: {
            xs: `"todaysEvents"
           "recentEvents"
           "upcomingEvents"`,
            md: `"recentEvents todaysEvents upcomingEvents"`
          },
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr 1fr"
          },
          gridTemplateRows: {
            xs: "auto auto auto",
            md: "auto"
          }
        }}
        elevation={5}
      >
        <div style={{ flex: 1, gridArea: "recentEvents" }}>
          <Typography
            variant="h3"
            sx={{
              color: "secondary.dark"
            }}
          >
            Recent Events
          </Typography>
          <EventCardList
            events={recentEvents}
            emptyMessage="None in the past 30 days"
          />
        </div>
        <div style={{ flex: 1, gridArea: "todaysEvents" }}>
          <Typography
            variant="h3"
            sx={{
              color: "primary.dark"
            }}
          >
            Today&apos;s Events
          </Typography>

          <EventCardList events={todaysEvents} emptyMessage="None today" />
        </div>
        <div style={{ flex: 1, gridArea: "upcomingEvents" }}>
          <Typography
            variant="h3"
            sx={{
              color: "secondary.dark"
            }}
          >
            Upcoming Events
          </Typography>
          <EventCardList
            events={upcomingEvents}
            emptyMessage="None in the next 30 days"
          />
        </div>
      </Paper>
      <Button
        variant="contained"
        sx={{
          marginTop: "2rem",
          marginBottom: "2rem"
        }}
        component={Link}
        href="/events"
      >
        Full events list &nbsp;
        <EventIcon />
      </Button>
    </>
  );
});

export default EventsDashboard;
