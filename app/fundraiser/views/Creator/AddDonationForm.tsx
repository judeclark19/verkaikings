import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import fundraiserState from "@/lib/FundraiserState";

export default function AddDonationForm() {
  const [loading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [customDonorName, setCustomDonorName] = useState("");
  const [manualDonationAmount, setManualDonationAmount] = useState("");
  const [success, setSuccess] = useState<string | null>("");

  const donors = fundraiserState.activeFundraiser?.confirmedDonations.map(
    (donation) => donation.userId
  );
  const pendingDonors = fundraiserState.activeFundraiser?.pendingDonations.map(
    (donation) => donation.userId
  );

  const nonDonors = userList.users.filter(
    (user) => !donors?.includes(user.id) && !pendingDonors?.includes(user.id)
  );

  const nonDonorsOptions = nonDonors
    .map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const finalDropdownValue =
      dropdownValue === "other" ? customDonorName : dropdownValue;

    try {
      setLoading(true);
      const fundraiserDocRef = doc(
        db,
        "fundraisers",
        fundraiserState.activeFundraiser!.id
      );

      await updateDoc(fundraiserDocRef, {
        confirmedDonations: [
          ...fundraiserState.activeFundraiser!.confirmedDonations,
          {
            userId: finalDropdownValue,
            amount: parseFloat(manualDonationAmount)
          }
        ]
      });

      setDropdownValue("");
      setCustomDonorName("");
      setManualDonationAmount("");
      setSuccess("Donation added successfully!");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error adding donation:", err);
      alert(`Error adding donation: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 300,
        margin: "2rem auto 0 auto"
      }}
    >
      {/* Dropdown with custom input */}
      <TextField
        select
        label="Donor"
        value={dropdownValue}
        onChange={(e) => setDropdownValue(e.target.value)}
        fullWidth
        required
      >
        <MenuItem value="other">Other/non-user</MenuItem>
        {nonDonorsOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {dropdownValue === "other" && (
        <TextField
          label="Custom donor name"
          value={customDonorName}
          onChange={(e) => setCustomDonorName(e.target.value)}
          fullWidth
          required
        />
      )}
      <NumericFormat
        customInput={TextField}
        label="Donation amount"
        variant="outlined"
        fullWidth
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
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {loading ? <CircularProgress color="inherit" size={24} /> : "Submit"}
      </Button>

      {success && <Alert severity="success">{success}</Alert>}
    </Box>
  );
}
