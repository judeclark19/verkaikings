import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { EmojiEmotions, Favorite, ThumbUp } from "@mui/icons-material";
import { AnswerType, ReactionType } from "@/lib/QandAState";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";
import { DocumentReference, getDoc, updateDoc } from "firebase/firestore";
import Tooltip from "@/components/Tooltip";

const AnswerReactions = observer(
  ({
    answer,
    qAndADocRef
  }: {
    answer: AnswerType;
    qAndADocRef: DocumentReference;
  }) => {
    const reactions = answer.reactions || [];

    const countReactions = (type: "like" | "love" | "laugh") =>
      reactions.filter((reaction: ReactionType) => reaction.type === type)
        .length;

    const getReactionUsers = (type: "like" | "love" | "laugh") =>
      reactions
        .filter((reaction) => reaction.type === type)
        .map((reaction) => {
          const user = appState.userList.users.find(
            (u) => u.id === reaction.authorId
          );
          return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
        });

    const handleReaction = async (reactionType: "like" | "love" | "laugh") => {
      if (!appState.loggedInUser) {
        console.error("User must be logged in to react.");
        return;
      }

      // Check if the user already reacted with this type
      const existingReaction = reactions.find(
        (reaction) =>
          reaction.authorId === appState.loggedInUser!.id &&
          reaction.type === reactionType
      );

      const qAndASnapshot = await getDoc(qAndADocRef);

      if (!qAndASnapshot.exists()) {
        throw new Error("No data found in the document.");
      }

      const qAndAData = qAndASnapshot.data();

      if (existingReaction) {
        // remove reaction
        try {
          // Find the answer and update reactions
          const updatedAnswers = qAndAData.answers.map(
            (answerData: AnswerType) => {
              if (answerData.id === answer.id) {
                return {
                  ...answerData,
                  reactions: answerData.reactions.filter(
                    (reaction) =>
                      !(
                        reaction.authorId === existingReaction.authorId &&
                        reaction.type === existingReaction.type
                      )
                  )
                };
              }
              return answer;
            }
          );

          // Update the document with the modified answers array
          await updateDoc(qAndADocRef, {
            answers: updatedAnswers
          });

          // console.log("Reaction removed successfully.");
        } catch (error) {
          console.error(`Error removing reaction: ${error}`);
          appState.setSnackbarMessage(`Error removing reaction: ${error}`);
        }
      } else {
        // Add the reaction
        const newReaction: ReactionType = {
          authorId: appState.loggedInUser.id,
          type: reactionType,
          createdAt: new Date().toISOString()
        };

        try {
          // Locate the correct answer and add the reaction
          const updatedAnswers = qAndAData.answers.map(
            (answerData: AnswerType) => {
              if (answerData.id === answer.id) {
                return {
                  ...answerData,
                  reactions: [...(answerData.reactions || []), newReaction]
                };
              }
              return answerData;
            }
          );

          // Update the document with the modified answers array
          await updateDoc(qAndADocRef, {
            answers: updatedAnswers
          });
        } catch (error) {
          alert(`Error adding reaction: ${error}`);
          console.error("Error adding reaction:", error);
        }
      }
    };

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2
          }}
        >
          <ButtonGroup variant="text" size="small">
            {[
              { type: "like", icon: <ThumbUp />, label: "Likes" },
              { type: "love", icon: <Favorite />, label: "Loves" },
              { type: "laugh", icon: <EmojiEmotions />, label: "Laughs" }
            ].map(({ type, icon, label }) => {
              const reactionCount = countReactions(
                type as "like" | "love" | "laugh"
              );
              const reactionUsers = getReactionUsers(
                type as "like" | "love" | "laugh"
              );

              return (
                <Tooltip
                  key={type}
                  title={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {label}
                      </Typography>
                      {reactionUsers.map((username, index) => (
                        <Typography
                          variant="body2"
                          key={index}
                          sx={{ fontSize: 12 }}
                        >
                          {username}
                        </Typography>
                      ))}
                    </Box>
                  }
                >
                  <Button
                    sx={{
                      px: 1,
                      color:
                        type === "love" && reactionCount > 0
                          ? "primary.dark"
                          : (type === "like" || type === "laugh") &&
                            reactionCount > 0
                          ? "warning.main"
                          : "text.secondary"
                    }}
                    id={`answer-${type}`}
                    startIcon={icon}
                    onClick={() =>
                      handleReaction(type as "like" | "love" | "laugh")
                    }
                  >
                    <Typography
                      sx={{
                        color:
                          reactionCount > 0 ? "text.primary" : "text.secondary" // Reaction count color
                      }}
                    >
                      {reactionCount}
                    </Typography>
                  </Button>
                </Tooltip>
              );
            })}
          </ButtonGroup>
        </Box>
      </>
    );
  }
);

export default AnswerReactions;
