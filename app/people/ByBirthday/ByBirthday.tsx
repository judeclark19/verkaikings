"use client";

import { Alert, Box, Button, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import ByMonth from "./ByMonth";
import userList from "@/lib/UserList";
import { useEffect } from "react";
import { PeopleViews } from "../PeopleList";

const ByBirthday = observer(() => {
  useEffect(() => {
    // if production environment is dev
    if (process.env.NODE_ENV === "development") {
      console.log("ByBirthday useEffect");
    }
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

      {!appState.isInitialized && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="70vh"
          sx={{ borderRadius: 1 }}
        />
      )}

      {userList.query && (
        <Alert
          sx={{
            my: 2,
            display: "flex",
            alignItems: "center"
          }}
          severity={
            Object.keys(userList.usersByBirthday).length === 0
              ? "error"
              : "info"
          }
        >
          {Object.keys(userList.usersByBirthday).length === 0
            ? `No users with birthdays found with `
            : `Showing results for `}
          the search query: &ldquo;
          {userList.query}&rdquo;.
          <Button
            onClick={() => {
              userList.setQuery("");
              userList.filterUsersByQuery("", PeopleViews.BIRTHDAY);
            }}
            sx={{
              ml: 2
            }}
            variant="contained"
            color="primary"
          >
            Clear search
          </Button>
        </Alert>
      )}

      {Object.keys(userList.usersByBirthday).length > 0 && (
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
      )}
    </>
  );
});

export default ByBirthday;
