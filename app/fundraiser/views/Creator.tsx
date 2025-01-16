import { Paper, Typography } from "@mui/material";
import Description from "../editableFields/Description";

const Creator = () => {
  return (
    <>
      <div>creator view</div>
      <Paper
        sx={{
          maxWidth: "670px",
          margin: "0 auto",
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
    </>
  );
};

export default Creator;
