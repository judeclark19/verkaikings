import { Metadata } from "next";
import { Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "People | Verkaikings"
};

function PeoplePage() {
  return <Typography variant="h1">List of People</Typography>;
}

export default PeoplePage;
