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
      Please{" "}
      <Link href="/login" style={{ color: "white" }}>
        log in
      </Link>
      .
    </Typography>
  );
};

export default WelcomeMessage;
