"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Link,
  Alert
} from "@mui/material";
import Cookies from "js-cookie";
import { observer } from "mobx-react-lite";
import PasswordResetModal from "./PasswordResetModal";
import PasswordInput from "@/components/PasswordInput";

const LoginForm = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get the Firebase ID token
      const token = await user.getIdToken();

      // Store the token in cookies (expires in 10 days)
      Cookies.set("authToken", token, { expires: 10 });

      // Force server-side navigation to ensure middleware checks the cookie
      window.location.href = "/"; // Triggers full page load
    } catch (err: unknown) {
      // Check if err is a Firebase error with a message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false); // Stop loading on error
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
        Log In
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
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

        <PasswordInput
          value={password}
          setValue={setPassword}
          label="Password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Box>
      {error && (
        <Alert
          sx={{
            mt: 2,
            width: "100%",
            maxWidth: "400px"
          }}
          severity="error"
        >
          {error}
        </Alert>
      )}

      <Typography
        sx={{
          my: 4
        }}
      >
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </Typography>
      <PasswordResetModal email={email} />
    </Box>
  );
});

export default LoginForm;
