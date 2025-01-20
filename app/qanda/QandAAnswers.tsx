import appState from "@/lib/AppState";
import { db } from "@/lib/firebase";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  List,
  TextField,
  Typography
} from "@mui/material";
import {
  collection,
  doc,
  DocumentReference,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { sendNotification } from "@/lib/clientUtils";
import { AnswerType, QandADocType } from "@/lib/QandAState";
import Answer from "./Answer";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import myProfileState from "../profile/MyProfile.state";

const QandAAnswers = ({
  qAndA,
  qAndADocRef
}: {
  qAndA: QandADocType;
  qAndADocRef: DocumentReference;
}) => {
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState<AnswerType[]>(qAndA.answers || []);

  useEffect(() => {
    if (!qAndA) return;

    const unsubscribe = onSnapshot(qAndADocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const qAndAData = docSnapshot.data();
        setAnswers(qAndAData.answers || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [qAndA.id]);

  if (!qAndA) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answerText.trim()) {
      if (!appState.loggedInUser) {
        console.error("Must be logged in to answer");
        return;
      }

      // Create a new answer
      const newAnswer: AnswerType = {
        id: doc(collection(db, `qanda/${qAndA.id}/ansswers`)).id,
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
    <>
      <Typography
        variant="h4"
        color="secondary.dark"
        sx={{
          my: 1
        }}
      >
        Answers
      </Typography>

      {/* Answers List */}
      {answers.length === 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mb: 1
          }}
        >
          No answers yet.
        </Typography>
      )}

      {answers.length === 1 && (
        <Answer
          qAndA={qAndA}
          qAndADocRef={qAndADocRef}
          answer={answers[0]}
          noDivider
        />
      )}

      {answers.length > 1 && (
        <Accordion
          sx={{
            mb: 2,
            "&.Mui-expanded:last-of-type": {
              mb: 2
            }
          }}
          disableGutters
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" color="textSecondary">
              {answers.length} Answers
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                mb: 2
              }}
            >
              {answers.map((answer) => (
                <Answer
                  key={answer.id}
                  qAndA={qAndA}
                  qAndADocRef={qAndADocRef}
                  answer={answer}
                  noDivider={answers.indexOf(answer) === answers.length - 1}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Add New Answer */}
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
    </>
  );
};

export default QandAAnswers;
