"use client";

import {
  checkIfBirthdayRecent,
  checkIfBirthdaySoon,
  checkIfBirthdayToday
} from "@/lib/clientUtils";
import appState from "@/lib/AppState";
import { Box, Button, Link, Paper, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import BirthdayCardList from "./BirthdayCardList";
import CakeIcon from "@mui/icons-material/Cake";

const Dashboard = observer(() => {
  const [recentBirthdays, setRecentBirthdays] = useState<DocumentData[]>([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState<DocumentData[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<DocumentData[]>(
    []
  );

  useEffect(() => {
    const recent: DocumentData[] = [];
    const today: DocumentData[] = [];
    const upcoming: DocumentData[] = [];

    appState.users
      .filter((user) => user.birthday)
      .forEach((user) => {
        if (checkIfBirthdayToday(user.birthday)) {
          today.push(user);
        } else if (checkIfBirthdayRecent(user.birthday)) {
          recent.push(user);
        } else if (checkIfBirthdaySoon(user.birthday)) {
          upcoming.push(user);
        }
      });

    setRecentBirthdays(recent);
    setTodaysBirthdays(today);
    setUpcomingBirthdays(upcoming);
  }, [appState.users]);

  return (
    <div>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateAreas: {
            xs: `"todaysBirthdays"
           "recentBirthdays"
           "upcomingBirthdays"`,
            sm: `"todaysBirthdays todaysBirthdays"
           "recentBirthdays upcomingBirthdays"`,
            lg: `"recentBirthdays todaysBirthdays upcomingBirthdays"`
          },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr"
          },
          gridTemplateRows: {
            xs: "auto auto auto",
            sm: "auto auto",
            lg: "auto"
          }
        }}
      >
        <Paper
          sx={{
            p: 2,
            gridArea: "recentBirthdays"
          }}
          elevation={0}
        >
          <Typography variant="h3">Recent Birthdays</Typography>
          <BirthdayCardList
            users={recentBirthdays}
            emptyMessage="None in the past week"
          />
        </Paper>
        <Paper
          sx={{
            p: 2,
            gridArea: "todaysBirthdays"
          }}
        >
          <Typography variant="h3">Today&apos;s Birthdays</Typography>
          <BirthdayCardList users={todaysBirthdays} emptyMessage="None today" />
        </Paper>
        <Paper
          sx={{
            p: 2,
            gridArea: "upcomingBirthdays"
          }}
          elevation={3}
        >
          <Typography variant="h3">Upcoming Birthdays</Typography>
          <BirthdayCardList
            users={upcomingBirthdays}
            emptyMessage="None within the next week"
          />
        </Paper>
      </Box>
      <Button
        variant="contained"
        sx={{
          marginTop: "2rem"
        }}
        component={Link}
        href="/people?viewBy=birthday"
      >
        Click to see the full birthday list &nbsp;
        <CakeIcon />
      </Button>
    </div>
  );
});

export default Dashboard;
