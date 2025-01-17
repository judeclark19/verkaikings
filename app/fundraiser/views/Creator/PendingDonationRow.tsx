import UserListItem from "@/app/people/UserListItem";
import userList from "@/lib/UserList";
import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import CheckIcon from "@mui/icons-material/Check";
import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";

const PendingDonationRow = observer(
  ({
    row,
    handleEdit,
    handleConfirm,
    handleDelete
  }: {
    row: {
      userId: string;
      amount: number;
    };
    handleEdit: (row: { userId: string; amount: number }) => void;
    handleConfirm: (row: { userId: string; amount: number }) => void;
    handleDelete: (row: { userId: string; amount: number }) => void;
  }) => {
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
            fontWeight: "bold"
          }}
        >
          <span
            style={{
              color: "var(--dark-green)"
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
            color="primary"
            onClick={() => handleConfirm(row)}
            aria-label="confirm"
            size="small"
          >
            <CheckIcon />
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

export default PendingDonationRow;
