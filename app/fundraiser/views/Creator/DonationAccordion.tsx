import UserListItem from "@/app/people/UserListItem";
import { UserDocType } from "@/lib/UserList";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";
import {
  Edit as EditIcon,
  HourglassEmpty as PendingIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import fundraiserState, { DonationType } from "@/lib/FundraiserState";
import { useState } from "react";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";

const DonationAccordion = observer(
  ({
    user,
    donation,
    confirmedOrPending,
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
    handleMakePending: (donation: DonationType) => void;
    handleConfirm: (donation: DonationType) => void;
    handleDelete: (donation: DonationType) => void;
  }) => {
    const [editing, setEditing] = useState(false);
    const [donationAmount, setDonationAmount] = useState(
      donation.amount.toLocaleString()
    );

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

            {editing ? (
              <div
                onClick={(e) => e.stopPropagation()} // Prevent event propagation
                onFocus={(e) => e.stopPropagation()} // Prevent focus event propagation
              >
                <NumericFormat
                  customInput={TextField}
                  label="€"
                  variant="outlined"
                  required
                  value={donationAmount}
                  decimalSeparator={new Intl.NumberFormat(appState.language)
                    .format(1.1)
                    .charAt(1)}
                  thousandSeparator={new Intl.NumberFormat(appState.language)
                    .format(1000)
                    .charAt(1)}
                  valueIsNumericString={true}
                  decimalScale={2}
                  onValueChange={(values: NumberFormatValues) => {
                    setDonationAmount(values.value);
                  }}
                  //   disabled={loading}
                  sx={{
                    width: "50px",
                    "& .MuiInputBase-root": {
                      fontSize: "1rem", // Smaller font size
                      padding: "6px 8px" // Adjust inner padding
                    },
                    "& .MuiInputBase-input": {
                      padding: "0"
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.75rem" // Smaller label font size
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px" // Optional: smaller border radius
                    },
                    "& .MuiFormLabel-root:not(.MuiInputLabel-shrink)": {
                      top: "-10px",
                      left: "-8px"
                    }
                  }}
                />
              </div>
            ) : (
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
            )}
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
              onClick={() => {
                if (
                  editing &&
                  !isNaN(parseFloat(donationAmount)) &&
                  parseFloat(donationAmount) !== donation.amount
                ) {
                  if (confirmedOrPending === "confirmed") {
                    fundraiserState.updateConfirmedDonationAmount(
                      donation,
                      parseFloat(donationAmount)
                    );
                  } else {
                    fundraiserState.updatePendingDonationAmount(
                      donation,
                      parseFloat(donationAmount)
                    );
                  }
                }

                setEditing(!editing);
              }}
              size="small"
              startIcon={editing ? <SaveIcon /> : <EditIcon />}
            >
              {editing ? "Save Amount" : "Edit Amount"}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

export default DonationAccordion;
