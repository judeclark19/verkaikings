import UserListItem from "@/app/people/UserListItem";
import userList from "@/lib/UserList";
import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { DonationType } from "@/lib/FundraiserState";
import { useState } from "react";
import EditAmountField from "./EditAmountField";

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
    const [editing, setEditing] = useState(false);

    return (
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row" sx={{ padding: 0 }}>
          {userList.users.find((user) => user.id === row.userId) ? (
            <UserListItem
              user={userList.users.find((user) => user.id === row.userId)!}
            />
          ) : (
            <Typography
              sx={{
                paddingLeft: "16px"
              }}
            >
              {row.userId}
            </Typography>
          )}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          {editing ? (
            <EditAmountField />
          ) : (
            <span
              style={{
                color: "var(--dark-pink)"
              }}
            >
              €{row.amount}
            </span>
          )}{" "}
          &nbsp;
          <IconButton
            color="secondary"
            onClick={() => setEditing(!editing)}
            aria-label="edit"
            size="small"
            sx={{
              marginRight: "-20px"
            }}
          >
            <EditIcon />
          </IconButton>
        </TableCell>
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
