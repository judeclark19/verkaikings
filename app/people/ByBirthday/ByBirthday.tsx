"use client";

import { Alert, Box, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import ByMonth from "./ByMonth";
import userList from "@/lib/UserList";
import { useEffect, useState } from "react";
import { toJS } from "mobx";

const ByBirthday = observer(() => {
  const [resultsCount, setResultsCount] = useState<number>(0);

  useEffect(() => {
    console.log(
      "ByBirthday useEffect",
      toJS(userList.usersByBirthday),
      Object.keys(userList.usersByBirthday).length
    );

    setResultsCount(Object.keys(userList.usersByBirthday).length);
  }, [userList.usersByBirthday]);

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        List of Birthdays
      </Typography>
      {appState.isInitialized &&
      Object.keys(userList.usersByBirthday).length ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              sx: "repeat(auto-fill,  1fr)",
              sm: "repeat(auto-fill, minmax(300px, 1fr))"
            },

            gap: "1rem"
          }}
        >
          {Object.keys(userList.usersByBirthday)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((month) => (
              <ByMonth key={month} month={month} />
            ))}
        </Box>
      ) : (
        <Alert
          sx={{
            mt: 2
          }}
          severity="info"
        >
          No birthdays found with the search query: &ldquo;{userList.query}
          &rdquo;.
        </Alert>
      )}

      {!appState.isInitialized && (
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
