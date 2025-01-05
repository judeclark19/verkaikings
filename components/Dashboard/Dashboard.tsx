"use client";

import {
  checkIfBirthdayRecent,
  checkIfBirthdaySoon,
  checkIfBirthdayToday
} from "@/lib/clientUtils";
import { Box, Button, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import BirthdayCardList from "./BirthdayCardList";
import CakeIcon from "@mui/icons-material/Cake";
import userList, { UserDocType } from "@/lib/UserList";

const Dashboard = observer(() => {
  const [recentBirthdays, setRecentBirthdays] = useState<UserDocType[]>([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState<UserDocType[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UserDocType[]>([]);

  useEffect(() => {
    const recentBirthdays: UserDocType[] = [];
    const todayBirthdays: UserDocType[] = [];
    const upcomingBirthdays: UserDocType[] = [];

    userList.users
      .filter((user) => user.birthday)
      .forEach((user) => {
        if (checkIfBirthdayToday(user.birthday!)) {
          todayBirthdays.push(user);
        } else if (checkIfBirthdayRecent(user.birthday!)) {
          recentBirthdays.push(user);
        } else if (checkIfBirthdaySoon(user.birthday!)) {
          upcomingBirthdays.push(user);
        }
      });

    const today = new Date();
    const currentYear = today.getFullYear();

    function getComparableDate(birthday: string) {
      let month;
      let day;

      if (birthday.startsWith("--")) {
        month = birthday.split("-")[2];
        day = birthday.split("-")[3];
      } else {
        month = birthday.split("-")[1];
        day = birthday.split("-")[2];
      }

      // Create a Date object using the normalized year
      return new Date(Number(currentYear), Number(month) - 1, Number(day));
    }

    // Sort recent birthdays: most recent first
    recentBirthdays.sort((a, b) => {
      const dateA = getComparableDate(a.birthday!);
      const dateB = getComparableDate(b.birthday!);

      // Sort by month/day first, treating them as same-year dates
      return dateB.getTime() - dateA.getTime();
    });

    // Sort upcoming birthdays: soonest first
    upcomingBirthdays.sort((a, b) => {
      const dateA = getComparableDate(a.birthday!);
      const dateB = getComparableDate(b.birthday!);

      // Sort by month/day first, treating them as same-year dates
      return dateA.getTime() - dateB.getTime();
    });

    console.log("upcoming sorted", upcomingBirthdays);

    setRecentBirthdays(recentBirthdays);
    setTodaysBirthdays(todayBirthdays);
    setUpcomingBirthdays(upcomingBirthdays);
  }, [userList.users]);

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
          <Typography
            variant="h3"
            sx={{
              color: "secondary.dark"
            }}
          >
            Recent Birthdays
          </Typography>
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
          <Typography
            variant="h3"
            sx={{
              color: "primary.dark"
            }}
          >
            Today&apos;s Birthdays
          </Typography>
          <BirthdayCardList users={todaysBirthdays} emptyMessage="None today" />
        </Paper>
        <Paper
          sx={{
            p: 2,
            gridArea: "upcomingBirthdays"
          }}
          elevation={6}
        >
          <Typography
            variant="h3"
            sx={{
              color: "secondary.dark"
            }}
          >
            Upcoming Birthdays
          </Typography>
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
      {/* <Box
        sx={{
          border: "1px solid red",
          marginTop: "2rem",
          height: "500px",
          fontSize: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Donation stuff here, on home page?
      </Box> */}
    </div>
  );
});

export default Dashboard;
