import appState from "@/lib/AppState";
import { Fundraiser } from "@/lib/FundraiserState";
import userList from "@/lib/UserList";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const DonationConfirmed = observer(
  ({ fundraiser }: { fundraiser: Fundraiser }) => {
    const confirmedDonation = fundraiser.data.confirmedDonations?.find(
      (donation) => donation.userId === appState.loggedInUser?.id
    );

    const creator = userList.users.find(
      (user) => user.id === fundraiser.data.creatorId
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
          €{fundraiser.formatNumberToCurrency(confirmedDonation!.amount)}
        </strong>
        !
      </Typography>
    );
  }
);

export default DonationConfirmed;
