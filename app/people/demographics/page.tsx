import { Metadata } from "next";
import { Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Demographics | Verkaikings"
};

function DemographicsPage() {
  return (
    <Typography variant="h1" sx={{ my: 2 }}>
      List of Birthdays
    </Typography>
  );
}

export default DemographicsPage;
