import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { Favorite, ThumbUp } from "@mui/icons-material";
import { AnswerType } from "@/lib/QandAState";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";
import {
  arrayRemove,
  arrayUnion,
  DocumentReference,
  getDoc,
  updateDoc
} from "firebase/firestore";
import Tooltip from "@/components/Tooltip";
import WowIcon from "@/components/Reactions/WowIcon";
import MindBlownIcon from "@/components/Reactions/MindBlownIcon";
import { cloneElement } from "react";
import LaughIcon from "@/components/Reactions/LaughIcon";
import { StoryDocType } from "@/lib/MyWillemijnStories";
import { sendNotification } from "@/lib/clientUtils";
import myProfileState from "@/app/profile/MyProfile.state";

export type ReactionName = "like" | "love" | "laugh" | "wow" | "mindBlown";

export type ReactionType = {
  authorId: string;
  type: ReactionName;
  createdAt: string;
};

const Reactions = observer(
  ({
    collection,
    document,
    documentRef
  }: {
    collection: "myWillemijnStories" | "qanda";
    document: StoryDocType | AnswerType;
    documentRef: DocumentReference;
  }) => {
    const reactions = document.reactions || [];

    const countReactions = (type: ReactionName) =>
      reactions.filter((reaction: ReactionType) => reaction.type === type)
        .length;

    const getReactionUsers = (type: ReactionName) =>
      reactions
        .filter((reaction) => reaction.type === type)
        .map((reaction) => {
          const user = appState.userList.users.find(
            (u) => u.id === reaction.authorId
          );
          return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
        });

    const handleQandAReaction = async (reactionType: ReactionName) => {
      if (!appState.loggedInUser) {
        console.error("User must be logged in to react.");
        return;
      }

      const snapshot = await getDoc(documentRef);

      if (!snapshot.exists()) {
        console.error("No data found in the document.");
        return;
      }

      const snapshotData = snapshot.data();

      const existingReaction = document.reactions.find(
        (reaction) =>
          reaction.authorId === appState.loggedInUser!.id &&
          reaction.type === reactionType
      );

      let updatedAnswers;
      if (existingReaction) {
        // Remove reaction
        updatedAnswers = snapshotData.answers.map((answerData: AnswerType) => {
          if (answerData.id === document.id) {
            return {
              ...answerData,
              reactions: answerData.reactions.filter(
                (reaction) =>
                  reaction.authorId !== existingReaction.authorId ||
                  reaction.type !== existingReaction.type
              )
            };
          }
          return answerData;
        });
      } else {
        // Add reaction
        const newReaction: ReactionType = {
          authorId: appState.loggedInUser.id,
          type: reactionType,
          createdAt: new Date().toISOString()
        };

        updatedAnswers = snapshotData.answers.map((answerData: AnswerType) => {
          if (answerData.id === document.id) {
            return {
              ...answerData,
              reactions: [...(answerData.reactions || []), newReaction]
            };
          }
          return answerData;
        });
      }

      try {
        await updateDoc(documentRef, { answers: updatedAnswers });
      } catch (error) {
        console.error("Error updating reactions:", error);
        appState.setSnackbarMessage(`Error updating reactions: ${error}`);
      }
    };
    const handleStoryReaction = async (reactionType: ReactionName) => {
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

      if (existingReaction) {
        try {
          await updateDoc(documentRef, {
            reactions: arrayRemove(existingReaction)
          });
        } catch (error) {
          alert(`Error removing reaction: ${error}`);
          console.error("Error removing reaction:", error);
        }
      } else {
        // Add the reaction
        const newReaction: ReactionType = {
          authorId: appState.loggedInUser.id,
          type: reactionType,
          createdAt: new Date().toISOString()
        };

        try {
          await updateDoc(documentRef, {
            reactions: arrayUnion(newReaction)
          });

          // send a notification to the author of the story

          if (document.authorId !== appState.loggedInUser.id) {
            sendNotification(
              document.authorId,
              "New reaction on your story",
              `${myProfileState.user!.firstName} ${
                myProfileState.user!.lastName
              } left a "${reactionType}"`,
              `/profile?notif=story-${reactionType}`
            );
          }
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
            mt: 1
          }}
        >
          <ButtonGroup
            variant="text"
            size="small"
            sx={{
              flexWrap: "wrap"
            }}
          >
            {[
              { type: "like", icon: <ThumbUp />, label: "Likes" },
              { type: "love", icon: <Favorite />, label: "Loves" },
              { type: "laugh", icon: <LaughIcon count={0} />, label: "Laughs" },
              { type: "wow", icon: <WowIcon count={0} />, label: "Wows" },
              {
                type: "mindBlown",
                icon: <MindBlownIcon count={0} />,
                label: "Minds Blown"
              }
            ].map(({ type, icon, label }) => {
              const reactionCount = countReactions(type as ReactionName);
              const reactionUsers = getReactionUsers(type as ReactionName);

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
                      px: window.innerWidth < 400 ? 0.5 : 1,
                      color:
                        type === "love" && reactionCount > 0
                          ? "primary.dark"
                          : type !== "love" && reactionCount > 0
                          ? "warning.main"
                          : "text.secondary",
                      justifyContent: "space-around",
                      "& .MuiButton-startIcon": {
                        marginRight: window.innerWidth < 400 ? "4px" : "8px"
                      }
                    }}
                    id={`answer-${type}`}
                    startIcon={cloneElement(icon, { count: reactionCount })}
                    onClick={() => {
                      if (collection === "myWillemijnStories") {
                        handleStoryReaction(type as ReactionName);
                      } else if (collection === "qanda") {
                        handleQandAReaction(type as ReactionName);
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          reactionCount > 0 ? "text.primary" : "text.secondary",
                        fontSize: window.innerWidth < 400 ? 14 : 16
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

export default Reactions;
