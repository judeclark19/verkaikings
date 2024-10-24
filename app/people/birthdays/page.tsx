import { Metadata } from "next";
import { Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Birthdays | Verkaikings"
};

function BirthdaysPage() {
  return <Typography variant="h1">List of Birthdays</Typography>;
}

export default BirthdaysPage;
