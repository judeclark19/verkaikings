"use client";
import Link from "next/link";
import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";
import UserListItem from "@/app/people/UserListItem";
import userList, { UserDocType } from "@/lib/UserList";

const WelcomeMessage = observer(
  ({ isLoggedIn, email }: { isLoggedIn: boolean; email: string | null }) => {
    const [loggedInUser, setLoggedInUser] = useState<UserDocType | null>(null);

    useEffect(() => {
      appState.waitForInitialization();
      if (!userList.users.length) return;

      const userToSet =
        userList.users.find((user) => user.email === email) || null;

      setLoggedInUser(userToSet);
    }, [appState.isInitialized, userList.users]);

    if (isLoggedIn)
      return (
        <>
          <Box
            sx={{
              width: "fit-content",
              margin: "1rem auto"
            }}
          >
            Logged in as{" "}
            {loggedInUser ? (
              <UserListItem user={loggedInUser} />
            ) : (
              <Skeleton
                variant="text"
                sx={{
                  width: "220px",
                  height: "48px"
                }}
              />
            )}
          </Box>
        </>
      );

    return (
      <Typography component="p">
        <Link href="/login" style={{ color: "white" }}>
          Log in
        </Link>{" "}
        or{" "}
        <Link href="/signup" style={{ color: "white" }}>
          sign up
        </Link>
        .
      </Typography>
    );
  }
);

export default WelcomeMessage;
