import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import appState from "@/lib/AppState";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const NewQForm = () => {
  const [newQuestionText, setNewQuestionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log("submitting question", newQuestionText);

    try {
      const newQuestion = {
        creatorId: appState.loggedInUser!.id,
        question: newQuestionText,
        createdAt: Timestamp.now()
      };

      const qAndACollectionRef = collection(db, "qanda");
      const newQDocRef = doc(qAndACollectionRef);
      await setDoc(newQDocRef, newQuestion);

      setSuccess("Question created successfully.");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create question.");
      }
    } finally {
      setLoading(false);
      setNewQuestionText("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: 670
      }}
    >
      <TextField
        label="Your question"
        variant="outlined"
        fullWidth
        required
        value={newQuestionText}
        onChange={(e) => setNewQuestionText(e.target.value)}
      />
      <Button
        sx={{
          mt: 2
        }}
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        {loading ? (
          <CircularProgress color="inherit" size={25} />
        ) : (
          "Submit question"
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default NewQForm;
