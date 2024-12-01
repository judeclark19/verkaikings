import {
  Box,
  Button,
  Typography,
  Modal,
  CircularProgress,
  TextField,
  Alert
} from "@mui/material";
import { useState } from "react";
import { auth } from "@/lib/firebase"; // Adjust path to your Firebase setup
import { sendPasswordResetEmail } from "firebase/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function PasswordResetModal({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [inputEmail, setInputEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, inputEmail);
      setSuccess(`Password reset link sent to ${inputEmail}`);

      setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Forgot password?
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="password-reset-modal-title"
        aria-describedby="password-reset-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="password-reset-modal-title"
            variant="h2"
            sx={{ mt: 0 }}
          >
            Password reset
          </Typography>
          <Typography id="password-reset-modal-description" sx={{ mt: 2 }}>
            Enter the email address associated with your account to request a
            password reset.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{
                mb: 2
              }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={14} /> : "Send reset link"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
