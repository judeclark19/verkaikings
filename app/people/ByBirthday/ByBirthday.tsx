"use client";

import { Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import peopleState from "../People.state";
import ByDay from "./ByDay";

const ByBirthday = observer(() => {
  function getMonthName(monthNumber: number, locale: string) {
    const date = new Date(2022, monthNumber - 1); // Use any non-leap year; January is 0
    return date.toLocaleString(locale, { month: "long" });
  }

  return (
    <>
      <Typography variant="h1">List of Birthdays</Typography>
      {peopleState.isFetched ? (
        <>
          {Object.keys(peopleState.usersByBirthday)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((month) => (
              <div key={month}>
                <Typography variant="h2">
                  {getMonthName(parseInt(month), navigator.language || "nl")}
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

export default ByBirthday;
