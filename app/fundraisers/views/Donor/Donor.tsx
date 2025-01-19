import UserListItem from "@/app/people/UserListItem";
import { Fundraiser } from "@/lib/FundraiserState";
import userList from "@/lib/UserList";
import { Box, List, Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import NoDonation from "./NoDonation";
import appState from "@/lib/AppState";
import DonationPending from "./DonationPending";
import DonationConfirmed from "./DonationConfirmed";

const Donor = observer(({ fundraiser }: { fundraiser: Fundraiser }) => {
  const { description, instructions, confirmedDonations, pendingDonations } =
    fundraiser.data;

  const donationIsPending = !!pendingDonations?.some(
    (donation) => donation.userId === appState.loggedInUser?.id
  );

  const donationIsConfirmed = !!confirmedDonations?.some(
    (donation) => donation.userId === appState.loggedInUser?.id
  );

  const noDonation = !donationIsPending && !donationIsConfirmed;

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
      {description && (
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
          <Typography
            sx={{
              whiteSpace: "pre-line"
            }}
          >
            {description}
          </Typography>
        </Paper>
      )}

      {instructions && (
        <Paper
          elevation={10}
          sx={{
            width: "100%",
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
            How to Donate
          </Typography>
          <Typography
            sx={{
              whiteSpace: "pre-line"
            }}
          >
            {instructions}
          </Typography>
        </Paper>
      )}

      {/* Donors */}
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
          Donors
        </Typography>

        {confirmedDonations.length === 0 && (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No donations yet.
          </Typography>
        )}

        {confirmedDonations.length > 0 && (
          <List
            sx={{
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {confirmedDonations.map((donation) => {
              const user = userList.users.find(
                (user) => user.id === donation.userId
              );

              if (!user) return null;
              return (
                <Box key={user.id}>
                  <UserListItem user={user} />
                </Box>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Your donation */}
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
          Your donation
        </Typography>

        {noDonation && <NoDonation fundraiser={fundraiser} />}
        {donationIsPending && <DonationPending fundraiser={fundraiser} />}
        {donationIsConfirmed && <DonationConfirmed fundraiser={fundraiser} />}
      </Paper>
    </Box>
  );
});

export default Donor;
