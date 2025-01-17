import appState from "@/lib/AppState";
import fundraiserState from "@/lib/FundraiserState";
import userList from "@/lib/UserList";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const DonationConfirmed = observer(() => {
  const confirmedDonation =
    fundraiserState.activeFundraiser?.confirmedDonations?.find(
      (donation) => donation.userId === appState.loggedInUser?.id
    );

  const creator = userList.users.find(
    (user) => user.id === fundraiserState.activeFundraiser?.creatorId
  );

  return (
    <Typography>
      Your donation has been received by {creator!.firstName}. Thank you for
      donating{" "}
      <strong
        style={{
          color: "var(--dark-pink)"
        }}
      >
        €{fundraiserState.formatNumberToCurrency(confirmedDonation!.amount)}
      </strong>
      !
    </Typography>
  );
});

export default DonationConfirmed;
