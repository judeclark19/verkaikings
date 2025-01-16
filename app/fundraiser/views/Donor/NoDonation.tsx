"use client";

import { Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import fundraiserState from "@/lib/FundraiserState";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";
import { NumericFormat, NumberFormatValues } from "react-number-format";

const NoDonation = observer(() => {
  const [pendingDonationAmount, setPendingDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!fundraiserState.activeFundraiser) {
    return null;
  }

  const { creatorId, title, pendingDonations } =
    fundraiserState.activeFundraiser;
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("submitting donation amount", pendingDonationAmount);
    setLoading(true);
    // locate fundraiser doc and create a new donation in the pendingDonations array

    try {
      const fundraiserDocRef = doc(
        db,
        "fundraisers",
        fundraiserState.activeFundraiser!.id
      );
      console.log("fundraiserDocRef", fundraiserDocRef);

      const newDonation = {
        userId: appState.loggedInUser!.id,
        amount: parseFloat(pendingDonationAmount)
      };

      console.log("pendingDonations", pendingDonations);

      await updateDoc(fundraiserDocRef, {
        pendingDonations: pendingDonations
          ? [...pendingDonations, newDonation]
          : [newDonation]
      });

      // notify creator
      // sendNotification(
      //   creatorId,
      //   `${appState.loggedInUser!.firstName} ${
      //     appState.loggedInUser!.lastName
      //   } donated to ${title}.`,
      //   `Please confirm the donation.`,
      //   `/fundraiser`
      // );

      console.log(
        "notification: ",
        creatorId,
        `${appState.loggedInUser!.firstName} ${
          appState.loggedInUser!.lastName
        } donated to ${title}.`,
        `Please confirm the donation.`,
        `/fundraiser`
      );
    } catch (err) {
      alert(`Error submitting donation: ${err}`);
      console.error("Error submitting donation", err);
    } finally {
      setPendingDonationAmount("");
      setLoading(false);
    }
  };

  return (
    <>
      <Typography>
        If you have donated to the cause, please also add yourself to the list
        by submitting your amount below. Then the creator will be able to
        approve your donation and you will appear on the{" "}
        <strong>"Donors"</strong> list.
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "1rem",
          maxWidth: "300px",
          margin: "1rem auto 0 auto"
        }}
      >
        <NumericFormat
          customInput={TextField}
          label="Donation amount"
          variant="outlined"
          fullWidth
          required
          value={pendingDonationAmount}
          decimalSeparator={new Intl.NumberFormat(appState.language)
            .format(1.1)
            .charAt(1)}
          thousandSeparator={new Intl.NumberFormat(appState.language)
            .format(1000)
            .charAt(1)}
          valueIsNumericString={true}
          decimalScale={2}
          onValueChange={(values: NumberFormatValues) => {
            setPendingDonationAmount(values.value);
          }}
        />
        <Button
          sx={{
            width: "100px"
          }}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {loading ? <CircularProgress color="inherit" size={14} /> : "Submit"}
        </Button>
      </form>
    </>
  );
});

export default NoDonation;
