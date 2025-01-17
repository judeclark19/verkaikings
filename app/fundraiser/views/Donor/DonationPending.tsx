import appState from "@/lib/AppState";
import fundraiserState from "@/lib/FundraiserState";
import userList from "@/lib/UserList";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const DonationPending = observer(() => {
  const pendingDonation =
    fundraiserState.activeFundraiser?.pendingDonations?.find(
      (donation) => donation.userId === appState.loggedInUser?.id
    );

  const creator = userList.users.find(
    (user) => user.id === fundraiserState.activeFundraiser?.creatorId
  );

  return (
    <Typography>
      Your{" "}
      <strong
        style={{
          color: "var(--dark-green)"
        }}
      >
        €{pendingDonation?.amount}
      </strong>{" "}
      donation is pending {creator!.firstName}&apos;s confirmation.
    </Typography>
  );
});

export default DonationPending;
