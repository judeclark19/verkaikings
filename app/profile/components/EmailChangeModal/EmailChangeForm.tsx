import PasswordInput from "@/components/PasswordInput";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";
import { FormEvent, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import myProfileState from "../../MyProfile.state";
import { observer } from "mobx-react-lite";

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

const EmailChangeForm = observer(
  ({ closeModal }: { closeModal: () => void }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(null);

      const user = auth.currentUser;

      if (!user) {
        setError("No authenticated user.");
        setLoading(false);
        return;
      }

      try {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Update the email
        await updateEmail(user, newEmail);

        // update userDoc
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, {
          email: newEmail
        });

        myProfileState.setEmail(newEmail);

        setSuccess("Email updated successfully.");
        setTimeout(() => {
          handleClose();
          setError(null);
          setSuccess(null);
        }, 2000);
      } catch (error) {
        console.error("Error updating email:", error);
        setError((error as Error).message || "Failed to update email.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Box sx={style}>
        <Typography id="email-change-modal-title" variant="h2" sx={{ mt: 0 }}>
          Change Email
        </Typography>
        <Typography id="email-change-modal-description" sx={{ mt: 2 }}>
          Enter your current password and new email address to update.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert
              sx={{
                mb: 2
              }}
              severity="error"
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              sx={{
                mb: 2
              }}
              severity="success"
            >
              {success}
            </Alert>
          )}

          <>
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              setValue={setCurrentPassword}
              autoComplete="current-password"
            />

            <TextField
              label="New Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
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
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={14} /> : "Update Email"}
              </Button>
            </Box>
          </>
        </Box>
      </Box>
    );
  }
);

export default EmailChangeForm;
