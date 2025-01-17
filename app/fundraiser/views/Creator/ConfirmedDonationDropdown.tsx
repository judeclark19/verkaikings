import UserListItem from "@/app/people/UserListItem";
import { UserDocType } from "@/lib/UserList";
import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  IconButton,
  Paper,
  Typography
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { DonationType } from "@/lib/FundraiserState";

const ConfirmedDonationDropdown = ({
  user,
  donation,
  handleEdit,
  handleMakePending,
  handleDelete
}: {
  user: UserDocType;
  donation: {
    userId: string;
    amount: number;
  };
  handleEdit: (donation: DonationType) => void;
  handleMakePending: (donation: DonationType) => void;
  handleDelete: (donation: DonationType) => void;
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
            // border: "1px solid red"
          }}
          // elevation={2}
          key={user.username}
        >
          <div>
            <UserListItem user={user} />
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              paddingRight: "1rem"
            }}
          >
            <Typography
              sx={{
                color: "primary.dark",
                fontWeight: "bold"
              }}
            >
              €{donation.amount}
            </Typography>
          </div>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {/* <IconButton
          color="warning"
          onClick={() => handleMakePending(donation)}
          aria-label="make pending"
          size="small"
        >
          <PendingIcon />
        </IconButton>

        <IconButton
          color="primary"
          onClick={() => handleEdit(donation)}
          aria-label="edit"
          size="small"
        >
          <EditIcon />
        </IconButton>

        <IconButton
          color="error"
          onClick={() => handleDelete(donation)}
          aria-label="delete"
          size="small"
        >
          <DeleteIcon />
        </IconButton> */}

        <Box
          sx={{
            // border: "1px solid lime",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleMakePending(donation)}
            size="small"
            startIcon={<PendingIcon />}
          >
            Make Pending
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (confirm("Are you sure you want to delete this donation?")) {
                handleDelete(donation);
              }
            }}
            size="small"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleEdit(donation)}
            size="small"
            startIcon={<EditIcon />}
          >
            Edit Amount
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ConfirmedDonationDropdown;
