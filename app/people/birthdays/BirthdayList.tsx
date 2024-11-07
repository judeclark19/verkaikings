"use client";

import { Skeleton, Typography } from "@mui/material";
import { DocumentData } from "firebase-admin/firestore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import peopleState from "../People.state";
import ByDay from "./ByDay";

const BirthdayList = observer(({ users }: { users: DocumentData[] }) => {
  const [locale, setLocale] = useState<string>("nl");

  useEffect(() => {
    setLocale(navigator.language || "nl");
    peopleState.init(users);
  }, []);

  function getMonthName(monthNumber: number, locale: string) {
    const date = new Date(2022, monthNumber - 1); // Use any non-leap year; January is 0
    return date.toLocaleString(locale, { month: "long" });
  }

  return (
    <>
      {peopleState.isFetched ? (
        <>
          {Object.keys(peopleState.usersByBirthday)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((month) => (
              <div key={month}>
                <Typography variant="h2">
                  {getMonthName(parseInt(month), locale)}
                </Typography>
                <div>
                  {Object.keys(peopleState.usersByBirthday[month])
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map((day) => (
                      <ByDay key={day} day={day} month={month} />
                    ))}
                </div>
              </div>
            ))}
        </>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="70vh"
          sx={{ borderRadius: 1 }}
        />
      )}
    </>
  );
});

export default BirthdayList;
