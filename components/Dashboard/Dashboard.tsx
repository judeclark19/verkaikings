"use client";

import { Button, Paper, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Cake as CakeIcon, Event as EventIcon } from "@mui/icons-material";
import eventsState, { EventDocType } from "@/app/events/Events.state";
import { toJS } from "mobx";
import BirthdayDashboard from "./BirthdayDashboard";
// import FundraiserPreview from "../../app/fundraisers/FundraiserPreview";
// import fundraiserState from "@/lib/FundraiserState";

const Dashboard = observer(() => {
  const [recentEvents, setRecentEvents] = useState<EventDocType[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<EventDocType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDocType[]>([]);

  useEffect(() => {
    console.log("todays date is", new Date().toLocaleDateString("en-CA"));
    // console.log("events", eventsState.allEvents);
    const recentEvents: EventDocType[] = [];
    const todayEvents: EventDocType[] = [];
    const upcomingEvents: EventDocType[] = [];

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA");

    const pastWeek = new Date();
    pastWeek.setDate(today.getDate() - 7); // 7 days ago

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7); // 7 days ahead

    eventsState.allEvents.forEach((event) => {
      const eventDate = new Date(event.date);

      if (event.date === todayStr) {
        todayEvents.push(event);
      } else if (eventDate >= pastWeek && eventDate < today) {
        recentEvents.push(event);
      } else if (eventDate > today && eventDate <= nextWeek) {
        upcomingEvents.push(event);
      }
    });
    console.log("recent events", toJS(recentEvents));
    console.log("today events", toJS(todayEvents));
    console.log("upcoming events", toJS(upcomingEvents));

    setRecentEvents(recentEvents);
    setTodaysEvents(todayEvents);
    setUpcomingEvents(upcomingEvents);
  }, [eventsState.allEvents]);

  return (
    <div>
      {/* FUNDRAISERS */}
      {/* <Box
        sx={{
          display:
            fundraiserState.activeFundraisers.length > 1 ? "grid" : "block",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr"
          },
          gap: 2,
          mb: 2
        }}
      >
        {fundraiserState.activeFundraisers
          .slice()
          .sort((a, b) => a.data.finalDay.localeCompare(b.data.finalDay))
          .map((activeFundraiser, i) => (
            <FundraiserPreview
              key={activeFundraiser.data.id}
              fundraiser={activeFundraiser}
              color={i % 2 === 0 ? "pink" : "green"}
              progressBarBackgroundColor="dark"
            />
          ))}
      </Box> */}

      <BirthdayDashboard />

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
          {recentEvents.length === 0 && (
            <Typography
              sx={{
                color: "text.secondary"
              }}
            >
              None in the past week
            </Typography>
          )}
          {recentEvents.length > 0 &&
            recentEvents.map((event) => (
              <MuiLink
                key={event.id}
                component={Link}
                href={`/events/${event.id}`}
              >
                {event.title}
              </MuiLink>
            ))}
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

          {todaysEvents.length === 0 && (
            <Typography
              sx={{
                color: "text.secondary"
              }}
            >
              None today
            </Typography>
          )}

          {todaysEvents.length > 0 &&
            todaysEvents.map((event) => (
              <MuiLink
                key={event.id}
                component={Link}
                href={`/events/${event.id}`}
              >
                {event.title}
              </MuiLink>
            ))}
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
          {upcomingEvents.length === 0 && (
            <Typography
              sx={{
                color: "text.secondary"
              }}
            >
              None within the next week
            </Typography>
          )}

          {upcomingEvents.length > 0 &&
            upcomingEvents.map((event) => (
              <MuiLink
                key={event.id}
                component={Link}
                href={`/events/${event.id}`}
              >
                {event.title}
              </MuiLink>
            ))}
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
    </div>
  );
});

export default Dashboard;
