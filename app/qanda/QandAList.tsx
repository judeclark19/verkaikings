"use client";

import qAndAState from "@/lib/QandAState";
import { Box, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import QandA from "./QandA";
import NewQForm from "./NewQForm";

const QuandAList = observer(() => {
  const { qAndA } = qAndAState;

  if (!qAndAState.isInitialized) {
    return (
      <>
        <Skeleton
          variant="rectangular"
          height={150}
          sx={{
            maxWidth: "500px",
            margin: "0 auto 2rem auto"
          }}
        />
        <Skeleton
          variant="rectangular"
          height={600}
          sx={{
            margin: "0 auto"
          }}
        />
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          marginBottom: "2rem"
        }}
      >
        <Typography>Ask a new question:</Typography>
        <NewQForm />
      </Box>

      <Box
        sx={{
          width: "100%",
          margin: "0 auto"
        }}
      >
        {qAndA.length === 0 && (
          <Typography
            sx={{
              textAlign: "center"
            }}
          >
            No questions yet...
          </Typography>
        )}
        {qAndA.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2
              }}
            >
              {qAndA.map((qAndA) => (
                <QandA key={qAndA.id} qAndA={qAndA} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
});

export default QuandAList;
