import fundraiserState from "@/lib/FundraiserState";
import { Box, LinearProgress, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const FundraiserProgressBar = observer(
  ({
    color = "pink",
    width = 100
  }: {
    color?: "pink" | "green";
    width?: number;
  }) => {
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
          value={Math.min(100, fundraiserState.progress)}
          sx={{
            width: "100%",
            height: "28px",
            borderRadius: "8px",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "secondary.dark",
              background:
                color === "pink"
                  ? `linear-gradient(to right, var(--light-pink), var(--dark-pink))`
                  : `linear-gradient(to right, var(--dark-green), var(--darker-green))`
            },
            backgroundColor: color === "pink" ? "secondary.main" : "#444"
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
