"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore imports
import { auth, db } from "@/lib/firebase";
import { PhoneNumberUtil } from "google-libphonenumber";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";
import Cookies from "js-cookie";
import { MuiPhone, PhoneData } from "./MuiPhone";
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneData, setPhoneData] = useState<PhoneData>({
    inputValue: "",
    phone: "",
    country: {
      name: "",
      iso2: "",
      dialCode: "",
      format: "",
      priority: 0,
      areaCodes: []
    }
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the form

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    setError(""); // Clear any previous errors

    console.log("is phone valid?", isPhoneValid(phoneData.phone));
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      Cookies.set("authToken", token, { expires: 1 });

      try {
        await updateProfile(user, {
          displayName: `${firstName}_${lastName}`
        });
        console.log("Display name updated successfully");
      } catch (updateError) {
        console.error("Failed to update display name:", updateError);
        throw updateError;
      }

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        username: `${firstName}_${lastName}`,
        email,
        phoneNumber: phoneData.phone,
        countryName: phoneData.country.name,
        countryCode: `+${phoneData.country.dialCode}`,
        nationalNumber: phoneData.phone.replace(
          `+${phoneData.country.dialCode}`,
          ""
        ),
        countryAbbr: phoneData.country.iso2
      });
      // setLoading(false);
      window.location.href = "/profile"; // Redirect to profile page after sign-up
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Stop loading if there's an error
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
          value={""}
          onChange={(data: PhoneData) => {
            setPhoneData(data);
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default SignupForm;
