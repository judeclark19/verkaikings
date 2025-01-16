import fundraiserState from "@/lib/FundraiserState";
import { Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const Donor = observer(() => {
  if (!fundraiserState.activeFundraiser) {
    return null;
  }

  const { description } = fundraiserState.activeFundraiser;

  return (
    <>
      {description && (
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
          <Typography
            sx={{
              whiteSpace: "pre-line"
            }}
          >
            {description}
          </Typography>
        </Paper>
      )}
    </>
  );
});

export default Donor;
