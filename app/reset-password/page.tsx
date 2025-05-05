"use client";
import { useEffect, useState } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset
} from "firebase/auth";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import RequestResetLinkForm from "./RequestResetLinkForm";

export default function ResetPassword() {
  const [stage, setStage] = useState<
    "checking" | "set" | "done" | "error" | "invalid"
  >("checking");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oob, setOob] = useState<string | null>(null);

  // 1 – validate the code when the page loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    setOob(code);
    if (!code) return setStage("invalid");
    verifyPasswordResetCode(getAuth(), code)
      .then(() => setStage("set"))
      .catch(() => setStage("error"));
  }, []);

  if (stage === "checking")
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4
        }}
      >
        {/* <Typography>Checking link…</Typography> */}
        <Alert severity="info" sx={{ maxWidth: "400px" }}>
          Checking link…
        </Alert>
      </Box>
    );

  if (stage === "error")
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4
        }}
      >
        <Alert severity="error" sx={{ maxWidth: "400px" }}>
          Link expired
        </Alert>
        <RequestResetLinkForm />
      </Box>
    );

  if (stage === "invalid")
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4
        }}
      >
        <Alert severity="error" sx={{ maxWidth: "400px" }}>
          Link invalid
        </Alert>
        <RequestResetLinkForm />
      </Box>
    );

  if (stage === "done")
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4
        }}
      >
        <Alert severity="success" sx={{ maxWidth: "400px" }}>
          Password updated ✔
        </Alert>
      </Box>
    );

  // stage === "set"
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
        Reset Password
      </Typography>

      <Box
        component="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");

          try {
            await confirmPasswordReset(getAuth(), oob!, password);
            setStage("done");
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("Failed to reset password.");
            }
          } finally {
            setLoading(false);
          }
        }}
        sx={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
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
    </Box>
  );
}
