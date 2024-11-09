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
  CircularProgress,
  Link
} from "@mui/material";
import Cookies from "js-cookie";
import { MuiPhone, PhoneData } from "./MuiPhone";
// import Link from "next/link";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const SignupForm = () => {
  const [signupStage, setSignupStage] = useState<1 | 2>(1);
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

  const checkPhoneNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    setError(""); // Clear any previous errors

    setTimeout(() => {
      setSignupStage(2);
      console.log("value after switching to step 2", phoneData.inputValue);
      setLoading(false);
    }, 1000);
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
      <Typography variant="h2" gutterBottom>
        Sign Up
      </Typography>
      {signupStage === 1 && (
        <>
          <form
            onSubmit={checkPhoneNumber}
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <MuiPhone
              value={phoneData.inputValue}
              onChange={(data: PhoneData) => {
                console.log(data.inputValue);
                setPhoneData(data);
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Phone Number"}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                setError(
                  "Sorry, that phone number was not found on our members list."
                );
              }}
            >
              Simulate Rejection
            </Button>
          </form>
          {error && (
            <Typography
              sx={{
                mt: 2
              }}
              color="error"
            >
              {error}
            </Typography>
          )}
        </>
      )}

      {signupStage === 2 && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("submitting");
            }}
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
              value={phoneData.inputValue}
              disabled
              onChange={() => {}}
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
        </>
      )}
      <Typography
        sx={{
          mt: 4
        }}
      >
        Already have an account? <Link href="/login">Log in</Link>
      </Typography>
    </Box>
  );
};

export default SignupForm;
