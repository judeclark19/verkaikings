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
import ConfirmedDonationRow from "./ConfirmedDonationRow";
import userList from "@/lib/UserList";
import ConfirmedDonationDropdown from "./ConfirmedDonationDropdown";

const ConfirmedDonations = observer(
  ({
    handleEdit,
    handleMakePending,
    handleDelete
  }: {
    handleEdit: (donation: DonationType) => void;
    handleMakePending: (donation: DonationType) => void;
    handleDelete: (donation: DonationType) => void;
  }) => {
    if (!fundraiserState.activeFundraiser) {
      return null;
    }

    const { confirmedDonations } = fundraiserState.activeFundraiser;

    //   const handleEdit = (row: { userId: string; amount: number }) => {
    //     console.log("Edit:", row);
    //     // Implement edit functionality here
    //   };

    //   const handleMakePending = (row: { userId: string; amount: number }) => {
    //     console.log("Make Pending:", row);
    //     // Implement make pending functionality here
    //   };

    //   const handleDelete = (row: { userId: string; amount: number }) => {
    //     if (confirm("Are you sure you want to delete this donation?")) {
    //       console.log("Delete:", row);
    //     }
    //     // Implement delete functionality here
    //   };

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
                  {/* <TableCell align="right" sx={{ fontSize: "1rem" }}>
                  Edit
                </TableCell> */}
                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Make Pending
                  </TableCell>

                  <TableCell align="right" sx={{ fontSize: "1rem" }}>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {confirmedDonations.map((row) => (
                  <ConfirmedDonationRow
                    row={row}
                    key={row.userId}
                    handleEdit={handleEdit}
                    handleMakePending={handleMakePending}
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
          {confirmedDonations.map((donation) => {
            const user = userList.users.find(
              (user) => user.id === donation.userId
            );

            return user ? (
              <ConfirmedDonationDropdown
                key={user.id}
                user={user}
                donation={donation}
                handleEdit={handleEdit}
                handleMakePending={handleMakePending}
                handleDelete={handleDelete}
              />
            ) : null;
          })}
        </Box>
      </>
    );
  }
);

export default ConfirmedDonations;
