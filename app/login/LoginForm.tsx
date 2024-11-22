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
  Link
} from "@mui/material";
import Cookies from "js-cookie";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

const LoginForm = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

      // Store the token in cookies (expires in 1 day)
      Cookies.set("authToken", token, { expires: 1 });

      // Force server-side navigation to ensure middleware checks the cookie
      window.location.href = "/profile"; // Triggers full page load
      // router.push("/profile");
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
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
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
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
      <Typography
        sx={{
          mt: 4
        }}
      >
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </Typography>
    </Box>
  );
});

export default LoginForm;
