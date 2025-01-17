import { Box, Divider, Paper, Typography } from "@mui/material";
import Description from "../../editableFields/Description";
import Instructions from "../../editableFields/Instructions";
import { observer } from "mobx-react-lite";
import fundraiserState, { DonationType } from "@/lib/FundraiserState";
import ConfirmedDonations from "./ConfirmedDonations";
import PendingDonations from "./PendingDonations";

const Creator = observer(() => {
  if (!fundraiserState.activeFundraiser) {
    return null;
  }

  const { confirmedDonations, pendingDonations } =
    fundraiserState.activeFundraiser;

  const handleEdit = (donation: DonationType) => {
    fundraiserState.handleEditDonation(donation);
  };

  const handleMakePending = (donation: DonationType) => {
    fundraiserState.handleMakeDonationPending(donation);
  };

  const handleConfirm = (donation: DonationType) => {
    fundraiserState.handleConfirmDonation(donation);
  };

  const handleDelete = (donation: DonationType) => {
    fundraiserState.handleDeleteDonation(donation);
  };

  return (
    <Box
      sx={{
        margin: "auto",
        marginTop: "2rem",
        width: "100%",
        gap: "1rem",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr"
        }
      }}
    >
      {/* Description */}
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

      {/* Instructions */}
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

      <Paper
        sx={{
          padding: "1rem"
        }}
        elevation={5}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center"
          }}
        >
          Confirmed Donors
        </Typography>

        {confirmedDonations.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No confirmed donors yet
          </Typography>
        ) : (
          <ConfirmedDonations
            handleEdit={handleEdit}
            handleMakePending={handleMakePending}
            handleDelete={handleDelete}
          />
        )}

        <Divider
          sx={{
            marginTop: "2rem",
            marginBottom: "2rem"
          }}
        />

        <Typography
          variant="h3"
          sx={{
            textAlign: "center"
          }}
        >
          Pending Donors
        </Typography>

        {pendingDonations.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No pending donors
          </Typography>
        ) : (
          <PendingDonations
            handleEdit={handleEdit}
            handleConfirm={handleConfirm}
            handleDelete={handleDelete}
            handleMakePending={handleMakePending}
          />
        )}
      </Paper>
    </Box>
  );
});

export default Creator;
