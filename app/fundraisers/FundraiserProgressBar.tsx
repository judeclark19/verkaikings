import { Box, LinearProgress, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const FundraiserProgressBar = observer(
  ({
    progress,
    color = "pink",
    backgroundColor = "dark",
    width = 100
  }: {
    progress: number;
    color?: "pink" | "green";
    backgroundColor?: "dark" | "light";
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
          value={Math.min(100, progress)}
          sx={{
            width: "100%",
            height: "28px",
            borderRadius: "8px",
            "& .MuiLinearProgress-bar": {
              background:
                color === "pink"
                  ? `linear-gradient(to right, var(--light-pink), var(--dark-pink))`
                  : `linear-gradient(to right, var(--dark-green), var(--darker-green))`
            },
            backgroundColor:
              backgroundColor === "light" ? "secondary.main" : "#444"
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.5rem"
          }}
        >{`${Math.round(progress)}%`}</Typography>
      </Box>
    );
  }
);

export default FundraiserProgressBar;
