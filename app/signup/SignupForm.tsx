"use client";

import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Link,
  Skeleton,
  Alert
} from "@mui/material";
import Cookies from "js-cookie";
import { MuiPhone, PhoneData } from "./MuiPhone";
import PasswordInput from "@/components/PasswordInput";
import { cleanNameString } from "@/lib/clientUtils";

type PhoneNumberDoc = {
  id: string;
  phoneNumber: string;
  userId?: string;
  name?: string;
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
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberDoc[]>([]);
  const [matchingPhoneId, setMatchingPhoneId] = useState("");

  useEffect(() => {
    async function fetchPhoneNumbers() {
      const fetchedPhoneNumbers = await getDocs(collection(db, "phoneNumbers"));
      return fetchedPhoneNumbers.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data()
          } as PhoneNumberDoc)
      );
    }

    fetchPhoneNumbers()
      .then((phoneNumbers) => {
        setPhoneNumbers(phoneNumbers);
      })
      .catch((err) => {
        console.error("Error fetching phone numbers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const checkPhoneNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChecking(true);
    setError("");

    const result = phoneNumbers.find((p) => p.phoneNumber === phoneData.phone);

    if (result && !result.userId) {
      setMatchingPhoneId(result.id);
      setSignupStage(2);
    } else if (result && result.userId) {
      setError("There is already an account signed up with this phone number.");
    } else {
      setError(
        `Sorry, that phone number was not found on our members list. If you think this may be a mistake, please send a message in the "Verkaikings Website" of our WhatsApp community.`
      );
    }
    setChecking(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChecking(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      Cookies.set("authToken", token, { expires: 10 });

      try {
        await updateProfile(user, {
          displayName: `${cleanNameString(firstName)}_${cleanNameString(
            lastName
          )}`
        });
        console.log("Display name updated successfully");
      } catch (updateError) {
        console.error("Failed to update display name:", updateError);
        throw updateError;
      }

      // create new user in firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: `${cleanNameString(firstName)}_${cleanNameString(lastName)}`,
        email,
        phoneNumber: phoneData.phone,
        countryCode: `+${phoneData.country.dialCode}`,
        nationalNumber: phoneData.phone.replace(
          `+${phoneData.country.dialCode}`,
          ""
        ),
        countryAbbr: phoneData.country.iso2
      });

      await updateDoc(doc(db, "phoneNumbers", matchingPhoneId), {
        userId: user.uid
      });

      window.location.href = "/profile"; // Redirect to profile page after sign-up
    } catch (err: unknown) {
      // Check if err is a Firebase error with a message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setChecking(false); // Stop loading on error
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
      <Typography variant="h2" gutterBottom>
        Sign Up
      </Typography>

      {loading ? (
        <Skeleton
          variant="rectangular"
          width="560px"
          height="300px"
          sx={{
            borderRadius: 2,
            maxWidth: "100%"
          }}
        />
      ) : (
        <>
          {signupStage === 1 && (
            <>
              <Typography
                gutterBottom
                sx={{
                  textAlign: "center"
                }}
              >
                This website is only for members of the &ldquo;Willemijn as
                Always&rdquo; WhatsApp group.
                <br />
                Please enter the phone number that you use in WhatsApp to
                continue.
              </Typography>
              <form
                onSubmit={checkPhoneNumber}
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <MuiPhone
                  value={phoneData.inputValue}
                  onChange={(data: PhoneData) => {
                    setPhoneData(data);
                  }}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {checking ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Submit Phone Number"
                  )}
                </Button>

                {process.env.NODE_ENV === "development" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setError(
                        `Sorry, that phone number was not found on our members list. If you think this may be a mistake, please send a message in the "Verkaikings Website" of our WhatsApp community.`
                      );
                    }}
                  >
                    Simulate Rejection
                  </Button>
                )}
              </form>
              {error && (
                <Alert
                  sx={{
                    mt: 2
                  }}
                  severity="error"
                >
                  {error}
                </Alert>
              )}
            </>
          )}
          {signupStage === 2 && (
            <>
              <Box
                component="form"
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
                  label="Last Name or Initial"
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
                  disabledCountry={phoneData.country.iso2}
                  sx={{
                    mt: 2,
                    mb: 3,
                    width: "100%"
                  }}
                />

                <PasswordInput
                  label="Password"
                  value={password}
                  setValue={setPassword}
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3
                  }}
                >
                  {checking ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
              </Box>
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
        </>
      )}
    </Box>
  );
};

export default SignupForm;
