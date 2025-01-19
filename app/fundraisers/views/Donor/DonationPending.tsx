import appState from "@/lib/AppState";
import { ActiveFundraiser } from "@/lib/FundraiserState";
import userList from "@/lib/UserList";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const DonationPending = observer(
  ({ fundraiser }: { fundraiser: ActiveFundraiser }) => {
    const pendingDonation = fundraiser.data.pendingDonations?.find(
      (donation) => donation.userId === appState.loggedInUser?.id
    );

    const creator = userList.users.find(
      (user) => user.id === fundraiser.data.creatorId
    );

    return (
      <Typography>
        Your{" "}
        <strong
          style={{
            color: "var(--dark-green)"
          }}
        >
          €{fundraiser.formatNumberToCurrency(pendingDonation!.amount)}
        </strong>{" "}
        donation is pending {creator!.firstName}&apos;s confirmation.
      </Typography>
    );
  }
);

export default DonationPending;
