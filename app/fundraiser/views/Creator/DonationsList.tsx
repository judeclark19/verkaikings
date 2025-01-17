import fundraiserState, { DonationType } from "@/lib/FundraiserState";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { observer } from "mobx-react-lite";
import userList from "@/lib/UserList";
import DonationTableRow from "./DonationTableRow";
import DonationAccordion from "./DonationAccordion";

const DonationsList = observer(
  ({
    confirmedOrPending,
    handleEdit,
    handleMakePending,
    handleConfirm,
    handleDelete
  }: {
    confirmedOrPending: "confirmed" | "pending";
    handleEdit: (donation: DonationType) => void;
    handleMakePending: (donation: DonationType) => void;
    handleConfirm: (donation: DonationType) => void;
    handleDelete: (donation: DonationType) => void;
  }) => {
    if (!fundraiserState.activeFundraiser) {
      return null;
    }

    let donationsToDisplay;
    if (confirmedOrPending === "confirmed") {
      donationsToDisplay = fundraiserState.activeFundraiser.confirmedDonations;
    } else {
      donationsToDisplay = fundraiserState.activeFundraiser.pendingDonations;
    }

    return (
      <>
        {/* Desktop */}
        <Box
          sx={{
            maxWidth: "100%",
            display: {
              xs: "none",
              sm: "block"
            }
          }}
        >
          <TableContainer component={Paper}>
            <Table aria-label={`${confirmedOrPending} donors`}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    {confirmedOrPending === "confirmed"
                      ? "Make Pending"
                      : "Confirm"}
                  </TableCell>

                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donationsToDisplay.map((row) => (
                  <DonationTableRow
                    row={row}
                    key={row.userId}
                    confirmedOrPending={confirmedOrPending}
                    // handleEdit={handleEdit}
                    handleMakePending={handleMakePending}
                    handleConfirm={handleConfirm}
                    handleDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Mobile */}
        <Box
          sx={{
            zIndex: 9,
            display: {
              xs: "block",
              sm: "none"
            },
            gap: 2,
            flexWrap: "wrap"
          }}
        >
          {donationsToDisplay.map((donation) => {
            const user = userList.users.find(
              (user) => user.id === donation.userId
            );

            return (
              <DonationAccordion
                key={user ? user.id : donation.userId}
                user={user ? user : donation.userId}
                donation={donation}
                confirmedOrPending={confirmedOrPending}
                handleEdit={handleEdit}
                handleMakePending={handleMakePending}
                handleConfirm={handleConfirm}
                handleDelete={handleDelete}
              />
            );
          })}
        </Box>
      </>
    );
  }
);

export default DonationsList;
