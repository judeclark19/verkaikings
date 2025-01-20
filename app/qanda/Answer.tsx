import appState from "@/lib/AppState";
import { AnswerType, QandADocType } from "@/lib/QandAState";
import { ListItem, Typography, Link, IconButton, Divider } from "@mui/material";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import DeleteIcon from "@mui/icons-material/Delete";
import AnswerReactions from "./AnswerReactions";

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
        <Typography variant="body2" sx={{ mt: 1 }}>
          {answer.text}
        </Typography>

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
