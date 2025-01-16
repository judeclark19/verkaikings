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
      <div>donor view</div>

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

          {description}
        </Paper>
      )}
    </>
  );
});

export default Donor;
