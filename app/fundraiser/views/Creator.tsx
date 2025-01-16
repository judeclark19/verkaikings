import { Box, Paper, Typography } from "@mui/material";
import Description from "../editableFields/Description";
import Instructions from "../editableFields/Instructions";

const Creator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "670px",
        margin: "auto",
        width: "100%",
        gap: "1rem"
      }}
    >
      <Paper
        sx={{
          padding: "1rem"
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center"
          }}
        >
          Description
        </Typography>
        <Description />
      </Paper>

      <Paper
        sx={{
          width: "100%",
          padding: "1rem"
        }}
        elevation={10}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center"
          }}
        >
          How to donate
        </Typography>
        <Instructions />
      </Paper>
    </Box>
  );
};

export default Creator;
