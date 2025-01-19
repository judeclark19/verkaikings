import UserListItem from "@/app/people/UserListItem";
import userList from "@/lib/UserList";
import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon,
  Check as CheckIcon
} from "@mui/icons-material";
import { ActiveFundraiser, DonationType } from "@/lib/FundraiserState";
import { useState } from "react";
import EditAmountField from "./EditAmountField";

const DonationTableRow = observer(
  ({
    fundraiser,
    row,
    confirmedOrPending,
    handleMakePending,
    handleConfirm,
    handleDelete
  }: {
    fundraiser: ActiveFundraiser;
    row: {
      userId: string;
      amount: number;
    };
    confirmedOrPending: "confirmed" | "pending";
    handleMakePending: (donation: DonationType) => void;
    handleConfirm: (donation: DonationType) => void;
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
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "0"
          }}
        >
          {editing ? (
            <EditAmountField
              fundraiser={fundraiser}
              donation={row}
              setEditing={setEditing}
              confirmedOrPending={confirmedOrPending}
            />
          ) : (
            <>
              <span
                style={{
                  color:
                    confirmedOrPending === "confirmed"
                      ? "var(--dark-pink)"
                      : "var(--dark-green)"
                }}
              >
                €{fundraiser.formatNumberToCurrency(row.amount)}
              </span>{" "}
              &nbsp;
              <IconButton
                color="secondary"
                onClick={() => setEditing(!editing)}
                aria-label="edit"
                size="small"
              >
                <EditIcon />
              </IconButton>
            </>
          )}
        </TableCell>

        {confirmedOrPending === "confirmed" ? (
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
        ) : (
          <TableCell align="right">
            <IconButton
              color="primary"
              onClick={() => handleConfirm(row)}
              aria-label="confirm"
              size="small"
            >
              <CheckIcon />
            </IconButton>
          </TableCell>
        )}

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

export default DonationTableRow;
