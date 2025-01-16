import fundraiserState from "@/lib/FundraiserState";
import { Box, LinearProgress, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const FundraiserProgressBar = observer(
  ({ width = 100 }: { width?: number }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 1,
          width: `${width}%`,
          margin: "auto"
        }}
      >
        <LinearProgress
          variant="determinate"
          value={fundraiserState.progress}
          sx={{
            width: "100%",
            height: "16px",
            borderRadius: "8px",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "secondary.dark" // Completed bar color
            },
            backgroundColor: "secondary.main" // Background color
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.5rem"
          }}
        >{`${Math.round(fundraiserState.progress)}%`}</Typography>
      </Box>
    );
  }
);

export default FundraiserProgressBar;
