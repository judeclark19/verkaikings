import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Typography
} from "@mui/material";
import { DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AnswerType, QandADocType } from "@/lib/QandAState";
import Answer from "./Answer";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import NewAnswerForm from "./NewAnswerForm";

const QandAAnswers = ({
  qAndA,
  qAndADocRef
}: {
  qAndA: QandADocType;
  qAndADocRef: DocumentReference;
}) => {
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
      <NewAnswerForm
        qAndA={qAndA}
        qAndADocRef={qAndADocRef}
        answers={answers}
      />
    </>
  );
};

export default QandAAnswers;
