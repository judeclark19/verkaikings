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
import PendingDonationRow from "./PendingDonationRow";
import userList from "@/lib/UserList";
import PendingDonationDropdown from "./PendingDonationDropdown";

const PendingDonations = observer(
  ({
    handleEdit,
    handleConfirm,
    handleDelete
  }: {
    handleEdit: (donation: DonationType) => void;
    handleConfirm: (donation: DonationType) => void;
    handleDelete: (donation: DonationType) => void;
  }) => {
    if (!fundraiserState.activeFundraiser) {
      return null;
    }

    const { pendingDonations } = fundraiserState.activeFundraiser;

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
            <Table aria-label="Confirmed donors">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Confirm
                  </TableCell>

                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingDonations.map((row) => (
                  <PendingDonationRow
                    row={row}
                    key={row.userId}
                    handleEdit={handleEdit}
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
          {pendingDonations.map((donation) => {
            const user = userList.users.find(
              (user) => user.id === donation.userId
            );

            return user ? (
              <PendingDonationDropdown
                key={user.id}
                user={user}
                donation={donation}
                handleEdit={handleEdit}
                handleConfirm={handleConfirm}
                handleDelete={handleDelete}
              />
            ) : null;
          })}
        </Box>
      </>
    );
  }
);

export default PendingDonations;
