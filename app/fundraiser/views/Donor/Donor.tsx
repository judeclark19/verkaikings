import UserListItem from "@/app/people/UserListItem";
import fundraiserState from "@/lib/FundraiserState";
import userList from "@/lib/UserList";

import { Box, List, Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import NoDonation from "./NoDonation";
import appState from "@/lib/AppState";

const Donor = observer(() => {
  if (!fundraiserState.activeFundraiser) {
    return null;
  }

  const { description, instructions, confirmedDonations, pendingDonations } =
    fundraiserState.activeFundraiser;

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
        width: "100%",
        gap: "1rem",
        border: "1px solid red",
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

      {instructions && (
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            padding: "1rem"
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
                <Box>
                  <UserListItem key={user.id} user={user} />
                </Box>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Your donation */}
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
          Your donation
        </Typography>

        {noDonation && <NoDonation />}
        {donationIsPending && <div>donation is pending</div>}
        {donationIsConfirmed && <div>donation is confirmed</div>}
      </Paper>
    </Box>
  );
});

export default Donor;
