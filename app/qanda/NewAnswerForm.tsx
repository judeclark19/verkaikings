import appState from "@/lib/AppState";
import { AnswerType, QandADocType } from "@/lib/QandAState";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  collection,
  doc,
  DocumentReference,
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Box, Button, TextField } from "@mui/material";
import { sendNotification } from "@/lib/clientUtils";
import myProfileState from "../profile/MyProfile.state";

const NewAnswerForm = observer(
  ({
    qAndA,
    qAndADocRef,
    answers
  }: {
    qAndA: QandADocType;
    qAndADocRef: DocumentReference;
    answers: AnswerType[];
  }) => {
    const [answerText, setAnswerText] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (answerText.trim()) {
        if (!appState.loggedInUser) {
          console.error("Must be logged in to answer");
          return;
        }

        // Create a new answer
        const newAnswer: AnswerType = {
          id: doc(collection(db, `qanda/${qAndA.id}/answers`)).id,
          authorId: appState.loggedInUser!.id,
          createdAt: new Date().toISOString(),
          text: answerText,
          reactions: []
        };

        try {
          await updateDoc(qAndADocRef, {
            answers: [...answers, newAnswer]
          });

          // Send a notification to the story author
          if (qAndA.creatorId !== appState.loggedInUser!.id) {
            sendNotification(
              qAndA.creatorId,
              "New answer to your question",
              `${myProfileState.user!.firstName} ${
                myProfileState.user!.lastName
              } left an answer`,
              `/qanda?notif=${newAnswer.id}`
            );
          }

          setAnswerText("");
        } catch (error) {
          alert(`Error adding answer: ${error}`);
          console.error("Error adding answer:", error);
        }
      } else {
        console.log("Answer cannot be empty");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
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
            type="submit"
            variant="contained"
            size="small"
            sx={{
              height: 40
            }}
            disabled={!answerText.trim()} // Disable button if input is empty
          >
            Post
          </Button>
        </Box>
      </form>
    );
  }
);

export default NewAnswerForm;
