"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore imports
import { auth, db } from "@/lib/firebase";
import { TextField, Button, Typography, Box } from "@mui/material";
import Cookies from "js-cookie";
import "react-phone-input-2/lib/material.css";
import { MuiPhone } from "./MuiPhone";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState(""); // Country code (e.g., +1)
  const [nationalNumber, setNationalNumber] = useState(""); // Phone number without country code
  const [countryAbbr, setCountryAbbr] = useState(""); // Country abbreviation (e.g., US)
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      Cookies.set("authToken", token, { expires: 1 });

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phoneNumber,
        countryCode,
        nationalNumber,
        countryAbbr
      });

      window.location.href = "/profile"; // Redirect to profile page after sign-up
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form
        onSubmit={handleSignUp}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="given-name"
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          autoComplete="family-name"
        />
        <MuiPhone
          value={phoneNumber}
          onChange={({
            phoneNumber,
            countryCode,
            countryAbbr,
            nationalNumber
          }) => {
            setPhoneNumber(phoneNumber);
            setCountryCode(countryCode);
            setCountryAbbr(countryAbbr);
            setNationalNumber(nationalNumber);
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default SignupForm;
