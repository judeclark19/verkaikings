"use client";

import { List, Typography } from "@mui/material";
import { DocumentData } from "firebase-admin/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import demographicsState from "../demographics/Demographics.state";
import UserListItem from "../demographics/UserListItem";

const BirthdayList = observer(({ users }: { users: DocumentData[] }) => {
  const [locale, setLocale] = useState<string>("nl");

  useEffect(() => {
    setLocale(navigator.language || "nl");
    demographicsState.init(users);
  }, []);

  function getMonthName(monthNumber: number, locale: string) {
    const date = new Date(2022, monthNumber - 1); // Use any non-leap year; January is 0
    return date.toLocaleString(locale, { month: "long" });
  }

  return (
    <>
      {Object.keys(demographicsState.usersByBirthday)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((month) => (
          <div key={month}>
            <Typography variant="h2">
              {getMonthName(parseInt(month), locale)}
            </Typography>
            <div>
              {Object.keys(demographicsState.usersByBirthday[month])
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((day) => (
                  <div key={day}>
                    <Typography variant="h3">{day}</Typography>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper"
                      }}
                    >
                      {demographicsState.usersByBirthday[month][day].map(
                        (user) => (
                          <UserListItem key={user.id} user={user} />
                        )
                      )}
                    </List>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </>
  );
});

export default BirthdayList;
