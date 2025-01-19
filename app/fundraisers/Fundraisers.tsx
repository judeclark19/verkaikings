"use client";

import appState from "@/lib/AppState";
import fundraiserState from "@/lib/FundraiserState";
import { Skeleton, Typography, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import FundraiserPreview from "./FundraiserPreview";

const Fundraisers = observer(() => {
  const { activeFundraisers, pastFundraisers } = fundraiserState;
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
        Active Fundraisers
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        {activeFundraisers.length === 0 && (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No active fundraisers
          </Typography>
        )}
        {activeFundraisers.length > 0 &&
          activeFundraisers
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

      {pastFundraisers.length > 0 && (
        <>
          <Typography
            variant="h2"
            sx={{
              textAlign: "center"
            }}
          >
            Past Fundraisers
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            {pastFundraisers
              .slice()
              .sort((a, b) => a.data.finalDay.localeCompare(b.data.finalDay))
              .map((pastFundraiser, i) => (
                <FundraiserPreview
                  key={pastFundraiser.data.id}
                  fundraiser={pastFundraiser}
                  color={i % 2 === 0 ? "pink" : "green"}
                  progressBarBackgroundColor="dark"
                />
              ))}
          </Box>
        </>
      )}
    </>
  );
});

export default Fundraisers;
