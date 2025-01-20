import appState from "@/lib/AppState";
import { AnswerType, QandADocType } from "@/lib/QandAState";
import {
  ListItem,
  Typography,
  Link,
  IconButton,
  Divider,
  Box,
  Button,
  TextField,
  CircularProgress
} from "@mui/material";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import AnswerReactions from "./AnswerReactions";
import { useState } from "react";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from "@mui/icons-material";

const Answer = observer(
  ({
    qAndA,
    qAndADocRef,
    answer,
    noDivider
  }: {
    qAndA: QandADocType;
    qAndADocRef: DocumentReference;
    answer: AnswerType;
    noDivider?: boolean;
  }) => {
    const answerAuthor = appState.userList.users.find(
      (user) => user.id === answer.authorId
    );
    const isOwnAnswer = answer.authorId === appState.loggedInUser?.id;

    const [editing, setEditing] = useState(false);
    const [answerText, setAnswerText] = useState(answer.text);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (answerToDelete: AnswerType) => {
      console.log("Deleting answer", answerToDelete);
      try {
        const updatedAnswers = qAndA.answers.filter(
          (answer) => answer.id !== answerToDelete.id
        );

        await updateDoc(qAndADocRef, { answers: updatedAnswers });
      } catch (error) {
        alert(`Error deleting answer: ${error}`);
        console.error("Error deleting answer:", error);
      }
    };

    const handleUpdateAnswerText = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      if (answerText.trim()) {
        if (!appState.loggedInUser) {
          console.error("Must be logged in to answer");
          return;
        }

        if (answerText.trim() === answer.text) {
          setEditing(false);
          return;
        }

        setLoading(true);

        try {
          const updatedAnswers = qAndA.answers.map((a) =>
            a.id === answer.id
              ? {
                  ...a,
                  text: answerText
                }
              : a
          );

          await updateDoc(qAndADocRef, { answers: updatedAnswers });
          appState.setSnackbarMessage("Answer updated.");
          // setAnswerText("");
        } catch (error) {
          alert(`Error adding answer: ${error}`);
          console.error("Error adding answer:", error);
        }
      } else {
        console.log("Answer cannot be empty");
      }
      setLoading(false);
      setEditing(false);
    };

    return (
      <ListItem
        id={answer.id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mb: 1,
          position: "relative",
          backgroundColor: "#121212"
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          <Link
            href={`/profile/${answerAuthor?.username || "#"}`}
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
          >
            {answerAuthor?.firstName} {answerAuthor?.lastName}
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 12, color: "gray" }}>
          {new Date(answer.createdAt).toLocaleString()}
        </Typography>

        {isOwnAnswer ? (
          <>
            {editing ? (
              <form
                onSubmit={handleUpdateAnswerText}
                style={{
                  width: "100%"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center"
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Write an answer..."
                    fullWidth
                    variant="outlined"
                    value={answerText}
                    required
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50%",
                      minWidth: "36px",
                      width: "36px",
                      height: "36px"
                    }}
                    type="submit"
                  >
                    {loading ? (
                      <span
                        style={{
                          marginTop: "6px"
                        }}
                      >
                        <CircularProgress color="inherit" size={22} />
                      </span>
                    ) : (
                      <SaveIcon />
                    )}
                  </Button>
                </Box>
              </form>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "end"
                }}
              >
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {answer.text}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "50%",
                    minWidth: "36px",
                    width: "36px",
                    height: "36px"
                  }}
                  onClick={() => setEditing(true)}
                >
                  <EditIcon />
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {answer.text}
          </Typography>
        )}

        {isOwnAnswer && (
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleDelete(answer)}
            sx={{
              position: "absolute",
              top: 0,
              right: "8px",
              color: "red"
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}

        <AnswerReactions answer={answer} qAndADocRef={qAndADocRef} />

        {!noDivider && (
          <Divider
            sx={{
              width: "100%",
              mt: 2
            }}
          />
        )}
      </ListItem>
    );
  }
);

export default Answer;
