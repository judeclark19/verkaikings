"use client";

import { Typography } from "@mui/material";
import { DocumentData } from "firebase-admin/firestore";

function getMonthName(monthNumber: number, locale = navigator.language) {
  const date = new Date(2022, monthNumber - 1); // Use any non-leap year; January is 0
  return date.toLocaleString(locale, { month: "long" });
}

function BirthdayList({ usersByMonth }: { usersByMonth: DocumentData }) {
  console.log(getMonthName(1)); // January
  console.log(usersByMonth);

  return (
    <div>
      {Object.keys(usersByMonth)
        .sort((a, b) => parseInt(a) - parseInt(b))

        .map((month) => (
          <div key={month}>
            <Typography variant="h2">
              {getMonthName(parseInt(month))}
            </Typography>
            {usersByMonth[month].map((user: DocumentData) => (
              <Typography key={user.id}>
                {user.birthday.split("-")[2]}: {user.username}
              </Typography>
            ))}
          </div>
        ))}
    </div>
  );
}

export default BirthdayList;
