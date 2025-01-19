import appState from "@/lib/AppState";
import { Fundraiser, DonationType } from "@/lib/FundraiserState";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import SaveIcon from "@mui/icons-material/Save";

const EditAmountField = observer(
  ({
    fundraiser,
    donation,
    setEditing,
    confirmedOrPending,
    includeSaveButton = true
  }: {
    fundraiser: Fundraiser;
    donation: DonationType;
    setEditing: (editing: boolean) => void;
    confirmedOrPending: "confirmed" | "pending";
    includeSaveButton?: boolean;
  }) => {
    const [manualDonationAmount, setManualDonationAmount] = useState(
      donation.amount.toLocaleString()
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (donation.amount === parseFloat(manualDonationAmount)) {
        setEditing(false);
      } else {
        setLoading(true);

        if (confirmedOrPending === "confirmed") {
          await fundraiser.updateConfirmedDonationAmount(
            donation,
            parseFloat(manualDonationAmount)
          );
        } else {
          await fundraiser.updatePendingDonationAmount(
            donation,
            parseFloat(manualDonationAmount)
          );
        }
        setLoading(false);
        setEditing(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <NumericFormat
          customInput={TextField}
          label="€"
          variant="outlined"
          required
          value={manualDonationAmount}
          decimalSeparator={new Intl.NumberFormat(appState.language)
            .format(1.1)
            .charAt(1)}
          thousandSeparator={new Intl.NumberFormat(appState.language)
            .format(1000)
            .charAt(1)}
          valueIsNumericString={true}
          decimalScale={2}
          onValueChange={(values: NumberFormatValues) => {
            setManualDonationAmount(values.value);
          }}
          disabled={loading}
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

        {includeSaveButton && (
          <IconButton
            color="secondary"
            aria-label="edit"
            size="small"
            type="submit"
          >
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              <SaveIcon />
            )}
          </IconButton>
        )}
      </form>
    );
  }
);

export default EditAmountField;
