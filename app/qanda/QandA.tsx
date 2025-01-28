import appState from "@/lib/AppState";
import { QandADocType } from "@/lib/QandAState";
import userList from "@/lib/UserList";
import {
  Paper,
  Typography,
  Link as MuiLink,
  Link,
  Button,
  Box,
  TextField,
  IconButton,
  CircularProgress
} from "@mui/material";
import { observer } from "mobx-react-lite";
import QandAAnswers from "./QandAAnswers";
import { useState } from "react";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import Tooltip from "@/components/Tooltip";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const QandA = observer(({ qAndA }: { qAndA: QandADocType }) => {
  const qAndADocRef = doc(db, "qanda", qAndA.id);
  const creator = userList.users.find((user) => user.id === qAndA.creatorId);
  const isOwnQuestion = appState.loggedInUser?.id === qAndA.creatorId;
  const [questionText, setQuestionText] = useState(qAndA.question);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (questionText.trim() === qAndA.question) {
      setEditing(false);
    } else {
      try {
        await updateDoc(qAndADocRef, {
          question: questionText
        });

        appState.setSnackbarMessage("Question updated.");
        setEditing(false);
      } catch (error) {
        appState.setSnackbarMessage("Error updating question.");
        console.error("Error updating question:", error);
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!isOwnQuestion) return;

    try {
      await deleteDoc(qAndADocRef);
      appState.setSnackbarMessage("Question deleted.");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        p: 2,
        width: "100%",
        maxWidth: 670,
        height: "fit-content"
      }}
      id={qAndA.id}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography
          sx={{
            color: "primary.dark"
          }}
        >
          {qAndA.createdAt.toDate().toLocaleString(appState.language, {
            dateStyle: "medium",
            timeStyle: "short"
          })}
          ,{" "}
          <MuiLink component={Link} href={`/profile/${creator?.username}`}>
            {creator?.firstName} {creator?.lastName}
          </MuiLink>{" "}
          asked:
        </Typography>

        {isOwnQuestion && (
          <Tooltip title="Delete question">
            <IconButton
              aria-label="delete"
              size="medium"
              onClick={() => {
                if (confirm("Are you sure you want to delete this question?")) {
                  handleDelete();
                }
              }}
              sx={{
                color: "red"
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {!isOwnQuestion && <Typography variant="h3">{qAndA.question}</Typography>}

      {isOwnQuestion && (
        <>
          {editing ? (
            <Box
              component="form"
              display="flex"
              alignItems="center"
              gap={1}
              onSubmit={handleSubmit}
            >
              <TextField
                label="Your question"
                variant="outlined"
                fullWidth
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                sx={{
                  mt: 1
                }}
              />{" "}
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  borderRadius: "50%",
                  minWidth: "36px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {loading ? (
                  <span
                    style={{
                      marginTop: "8px"
                    }}
                  >
                    <CircularProgress color="inherit" size={22} />
                  </span>
                ) : (
                  <SaveIcon />
                )}
              </Button>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h3">{qAndA.question}</Typography>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "50%",
                  minWidth: "36px",
                  width: "36px"
                }}
                onClick={() => setEditing(true)}
              >
                <EditIcon />
              </Button>
            </Box>
          )}
        </>
      )}

      <QandAAnswers qAndA={qAndA} qAndADocRef={qAndADocRef} />
    </Paper>
  );
});

export default QandA;
