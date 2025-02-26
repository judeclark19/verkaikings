"use client";

import BirthdayDashboard from "./BirthdayDashboard";
import EventsDashboard from "./EventsDashboard";
// import FundraiserPreview from "../../app/fundraisers/FundraiserPreview";
// import fundraiserState from "@/lib/FundraiserState";

const Dashboard = () => {
  return (
    <div>
      {/* FUNDRAISERS */}
      {/* <Box
        sx={{
          display:
            fundraiserState.activeFundraisers.length > 1 ? "grid" : "block",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr"
          },
          gap: 2,
          mb: 2
        }}
      >
        {fundraiserState.activeFundraisers
          .slice()
          .sort((a, b) => a.data.finalDay.localeCompare(b.data.finalDay))
          .map((activeFundraiser, i) => (
            <FundraiserPreview
              key={activeFundraiser.data.id}
              fundraiser={activeFundraiser}
              color={i % 2 === 0 ? "pink" : "green"}
              progressBarBackgroundColor="dark"
            />
          ))}
      </Box> */}

      <BirthdayDashboard />

      <EventsDashboard />
    </div>
  );
};

export default Dashboard;
