import UserListItem from "@/app/people/UserListItem";
import userList from "@/lib/UserList";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { observer } from "mobx-react-lite";

import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { DonationType } from "@/lib/FundraiserState";

const ConfirmedDonationRow = observer(
  ({
    row,
    handleEdit,
    handleMakePending,
    handleDelete
  }: {
    row: {
      userId: string;
      amount: number;
    };
    handleEdit: (donation: DonationType) => void;
    handleMakePending: (donation: DonationType) => void;
    handleDelete: (donation: DonationType) => void;
  }) => {
    return (
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row" sx={{ padding: 0 }}>
          {userList.users.find((user) => user.id === row.userId) ? (
            <UserListItem
              user={userList.users.find((user) => user.id === row.userId)!}
            />
          ) : (
            <div>Anonymous</div>
          )}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold"
          }}
        >
          <span
            style={{
              color: "var(--dark-pink)"
            }}
          >
            €{row.amount}
          </span>{" "}
          &nbsp;
          <IconButton
            color="secondary"
            onClick={() => handleEdit(row)}
            aria-label="edit"
            size="small"
            sx={{
              marginRight: "-20px"
            }}
          >
            <EditIcon />
          </IconButton>
        </TableCell>
        {/* <TableCell align="right">
          <IconButton
            color="primary"
            onClick={() => handleEdit(row)}
            aria-label="edit"
            size="small"
          >
            <EditIcon />
          </IconButton>
        </TableCell> */}
        <TableCell align="right">
          <IconButton
            color="warning"
            onClick={() => handleMakePending(row)}
            aria-label="make pending"
            size="small"
          >
            <PendingIcon />
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="error"
            onClick={() => handleDelete(row)}
            aria-label="delete"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
);

export default ConfirmedDonationRow;
