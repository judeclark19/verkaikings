"use client";

import { Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import ByMonth from "./ByMonth";

const ByBirthday = observer(() => {
  return (
    <>
      <Typography variant="h1">List of Birthdays</Typography>
      {appState.isInitialized &&
      Object.keys(appState.usersByBirthday).length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",

            gap: "1rem"
          }}
        >
          {Object.keys(appState.usersByBirthday)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((month) => (
              <ByMonth key={month} month={month} />
            ))}
        </div>
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
