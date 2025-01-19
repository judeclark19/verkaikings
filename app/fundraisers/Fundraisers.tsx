"use client";

import appState from "@/lib/AppState";
import fundraiserState from "@/lib/FundraiserState";
import { Skeleton, Typography, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import FundraiserPreview from "./FundraiserPreview";

const Fundraisers = observer(() => {
  const { activeFundraisers } = fundraiserState;
  if (!appState.isInitialized) {
    return (
      <>
        <Skeleton
          variant="text"
          sx={{
            fontSize: "5rem",
            textAlign: "center",
            margin: "auto",
            mb: 2,
            width: "50%"
          }}
        />
        <Skeleton variant="rectangular" height={500} />
      </>
    );
  }

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Fundraisers
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        {activeFundraisers
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
      </Box>
    </>
  );
});

export default Fundraisers;
