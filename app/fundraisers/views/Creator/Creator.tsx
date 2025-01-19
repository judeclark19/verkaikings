import { Box, Divider, Paper, Typography } from "@mui/material";
import Description from "../../editableFields/Description";
import Instructions from "../../editableFields/Instructions";
import { observer } from "mobx-react-lite";
import { Fundraiser, DonationType } from "@/lib/FundraiserState";
import AddDonationForm from "./AddDonationForm";
import DonationsList from "./DonationsList";

const Creator = observer(({ fundraiser }: { fundraiser: Fundraiser }) => {
  const { confirmedDonations, pendingDonations } = fundraiser.data;

  const handleMakePending = (donation: DonationType) => {
    fundraiser.handleMakeDonationPending(donation);
  };

  const handleConfirm = (donation: DonationType) => {
    fundraiser.handleConfirmDonation(donation);
  };

  const handleDeletePending = (donation: DonationType) => {
    fundraiser.handleDeletePendingDonation(donation);
  };

  const handleDeleteConfirmed = (donation: DonationType) => {
    fundraiser.handleDeleteConfirmedDonation(donation);
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
          padding: "1rem",
          height: "fit-content"
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
        <Description fundraiser={fundraiser} />
      </Paper>

      {/* Instructions */}
      <Paper
        sx={{
          width: "100%",
          padding: "1rem",
          height: "fit-content"
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
        <Instructions fundraiser={fundraiser} />
      </Paper>

      <Paper
        sx={{
          padding: "1rem",
          height: "fit-content"
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

        {!confirmedDonations || confirmedDonations.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No confirmed donors yet
          </Typography>
        ) : (
          <DonationsList
            confirmedOrPending="confirmed"
            fundraiser={fundraiser}
            handleMakePending={handleMakePending}
            handleConfirm={handleConfirm}
            handleDelete={handleDeleteConfirmed}
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

        {!pendingDonations || pendingDonations.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No pending donors
          </Typography>
        ) : (
          <DonationsList
            fundraiser={fundraiser}
            confirmedOrPending="pending"
            handleMakePending={handleMakePending}
            handleConfirm={handleConfirm}
            handleDelete={handleDeletePending}
          />
        )}
      </Paper>

      <Paper
        sx={{
          padding: "1rem",
          height: "fit-content"
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center"
          }}
        >
          Manually add donation
        </Typography>
        <Typography>
          Enter your own donation or add a donation on behalf of someone else
          who is not a member of this site.
        </Typography>
        <AddDonationForm fundraiser={fundraiser} />
      </Paper>
    </Box>
  );
});

export default Creator;
