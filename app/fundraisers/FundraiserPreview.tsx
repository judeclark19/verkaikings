import FundraiserProgressBar from "@/app/fundraisers/FundraiserProgressBar";
import appState from "@/lib/AppState";
import { ActiveFundraiser } from "@/lib/FundraiserState";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const FundraiserPreview = observer(
  ({
    fundraiser,
    color,
    progressBarBackgroundColor
  }: {
    fundraiser: ActiveFundraiser;
    color: "pink" | "green";
    progressBarBackgroundColor: "dark" | "light";
  }) => {
    if (!appState.isInitialized) {
      return <Skeleton variant="rectangular" height={250} />;
    }

    return (
      <Button
        variant="contained"
        component={Link}
        href={`/fundraisers/${fundraiser.data.id}`}
        sx={{
          backgroundColor:
            color === "pink" ? "primary.dark" : "var(--darker-green)",
          width: "100%",
          textTransform: "none",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            backgroundColor:
              color === "pink" ? "var(--med-pink)" : "var(--dark-green)"
          }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 0
          }}
        >
          {fundraiser.data.title}
        </Typography>
        <Box sx={{ width: "90%", textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              mb: 0
            }}
          >{`Raised €${fundraiser.currentAmount} of €${fundraiser.data.goalAmount}`}</Typography>
          <FundraiserProgressBar
            color={color === "pink" ? "green" : "pink"}
            backgroundColor={progressBarBackgroundColor}
            progress={fundraiser.progress}
          />
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mb: 3
          }}
        >
          Click to see full details
        </Typography>
      </Button>
    );
  }
);

export default FundraiserPreview;
