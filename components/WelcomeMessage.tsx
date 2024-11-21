"use client";
import Link from "next/link";
import { Typography } from "@mui/material";

const WelcomeMessage = ({
  isLoggedIn,
  email
}: {
  isLoggedIn: boolean;
  email: string | null;
}) => {
  if (isLoggedIn) return <div>Logged in as {email}</div>;

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
};

export default WelcomeMessage;
