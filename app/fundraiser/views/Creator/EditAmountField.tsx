import appState from "@/lib/AppState";
import { TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { NumericFormat, NumberFormatValues } from "react-number-format";

const EditAmountField = observer(() => {
  const [manualDonationAmount, setManualDonationAmount] = useState("");
  return (
    <>
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
        sx={{
          width: "50px",
          "& .MuiInputBase-root": {
            fontSize: "1rem", // Smaller font size
            padding: "8px" // Adjust inner padding
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
    </>
  );
});

export default EditAmountField;
