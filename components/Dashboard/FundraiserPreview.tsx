import FundraiserProgressBar from "@/app/fundraiser/FundraiserProgressBar";
import appState from "@/lib/AppState";
import fundraiserState from "@/lib/FundraiserState";
import {
  Box,
  Button,
  LinearProgress,
  Skeleton,
  Typography
} from "@mui/material";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const FundraiserPreview = observer(() => {
  const { activeFundraiser } = fundraiserState;

  if (!appState.isInitialized || !activeFundraiser) {
    return (
      <Skeleton
        variant="rectangular"
        height={250}
        sx={{ marginBottom: "32px" }}
      />
    );
  }

  const current = activeFundraiser.currentAmount;
  const goal = activeFundraiser.goalAmount;
  const progress = (current / goal) * 100;

  return (
    <Button
      variant="contained"
      component={Link}
      href="/fundraiser"
      sx={{
        backgroundColor: "primary.dark",
        mb: 4,
        width: "100%",
        textTransform: "none",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          backgroundColor: "var(--med-pink)"
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
        {activeFundraiser.title}
      </Typography>
      <Box sx={{ width: "90%", textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            mb: 0
          }}
        >{`Raised $${current.toLocaleString()} of $${goal.toLocaleString()}`}</Typography>
        <FundraiserProgressBar />
      </Box>
    </Button>
  );
});

export default FundraiserPreview;
