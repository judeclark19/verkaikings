import UserListItem from "@/app/people/UserListItem";
import { UserDocType } from "@/lib/UserList";
import { Box, Button, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CheckIcon from "@mui/icons-material/Check";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { DonationType } from "@/lib/FundraiserState";

const DonationAccordion = ({
  user,
  donation,
  confirmedOrPending,
  handleEdit,
  handleMakePending,
  handleConfirm,
  handleDelete
}: {
  user: UserDocType | string;
  donation: {
    userId: string;
    amount: number;
  };
  confirmedOrPending: "confirmed" | "pending";
  handleEdit: (donation: DonationType) => void;
  handleMakePending: (donation: DonationType) => void;
  handleConfirm: (donation: DonationType) => void;
  handleDelete: (donation: DonationType) => void;
}) => {
  return (
    <Accordion disableGutters>
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
          }}
          key={typeof user === "string" ? user : user.id}
        >
          <div>
            {typeof user === "string" ? (
              <>{user}</>
            ) : (
              <UserListItem user={user} />
            )}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          {confirmedOrPending === "confirmed" ? (
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleMakePending(donation)}
              size="small"
              startIcon={<PendingIcon />}
            >
              Make Pending
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirm(donation)}
              size="small"
              startIcon={<CheckIcon />}
            >
              Confirm
            </Button>
          )}

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

export default DonationAccordion;
