import { Button, Paper, Typography } from "@mui/material";
import BirthdayCardList from "./BirthdayCardList";
import Link from "next/link";
import { Cake as CakeIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import userList, { UserDocType } from "@/lib/UserList";
import {
  checkIfBirthdayRecent,
  checkIfBirthdaySoon,
  checkIfBirthdayToday
} from "@/lib/clientUtils";
import { observer } from "mobx-react-lite";

const BirthdayDashboard = observer(() => {
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

    setRecentBirthdays(recentBirthdays);
    setTodaysBirthdays(todayBirthdays);
    setUpcomingBirthdays(upcomingBirthdays);
  }, [userList.users]);
  return (
    <>
      {/* BIRTHDAYS */}
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
            xs: `"todaysBirthdays"
           "recentBirthdays"
           "upcomingBirthdays"`,
            md: `"recentBirthdays todaysBirthdays upcomingBirthdays"`
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
        elevation={0}
      >
        <div style={{ flex: 1, gridArea: "recentBirthdays" }}>
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
        </div>
        <div style={{ flex: 1, gridArea: "todaysBirthdays" }}>
          <Typography
            variant="h3"
            sx={{
              color: "primary.dark"
            }}
          >
            Today&apos;s Birthdays
          </Typography>
          <BirthdayCardList users={todaysBirthdays} emptyMessage="None today" />
        </div>
        <div style={{ flex: 1, gridArea: "upcomingBirthdays" }}>
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
        </div>
      </Paper>
      <Button
        variant="contained"
        sx={{
          marginTop: "2rem",
          marginBottom: "2rem"
        }}
        component={Link}
        href="/people?viewBy=birthday"
      >
        Full birthday list &nbsp;
        <CakeIcon />
      </Button>
    </>
  );
});

export default BirthdayDashboard;
