import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { Favorite, ThumbUp } from "@mui/icons-material";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";
import {
  arrayRemove,
  arrayUnion,
  DocumentReference,
  DocumentData,
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
import { CommentType } from "../Comments/Comment";
import { CollectionName } from "@/lib/firebase";

export type ReactionName = "like" | "love" | "laugh" | "wow" | "mindBlown";

export type ReactionType = {
  authorId: string;
  type: ReactionName;
  createdAt: string;
};

// Utility function for handling reactions
const handleReaction = async (
  reactionType: ReactionName,
  config: {
    documentRef: DocumentReference;
    itemId: string;
    getArray: (docData: DocumentData) => CommentType[];
    updateArray: (
      docData: DocumentData,
      updatedArray: CommentType[]
    ) => Partial<DocumentData>;
  }
) => {
  if (!appState.loggedInUser) {
    console.error("User must be logged in to react.");
    return;
  }

  const snapshot = await getDoc(config.documentRef);
  if (!snapshot.exists()) {
    console.error("No data found in the document.");
    return;
  }

  const snapshotData = snapshot.data();
  const array = config.getArray(snapshotData);
  const item = array.find((entry: CommentType) => entry.id === config.itemId);

  if (!item) {
    console.error("Item not found.");
    return;
  }

  const existingReaction = item.reactions?.find(
    (reaction: ReactionType) =>
      reaction.authorId === appState.loggedInUser!.id &&
      reaction.type === reactionType
  );

  const updatedArray = array.map((entry: CommentType) =>
    entry.id === config.itemId
      ? {
          ...entry,
          reactions: existingReaction
            ? entry.reactions!.filter(
                (reaction: ReactionType) =>
                  reaction.authorId !== existingReaction.authorId ||
                  reaction.type !== existingReaction.type
              )
            : [
                ...(entry.reactions || []),
                {
                  authorId: appState.loggedInUser!.id,
                  type: reactionType,
                  createdAt: new Date().toISOString()
                }
              ]
        }
      : entry
  );

  try {
    await updateDoc(
      config.documentRef,
      config.updateArray(snapshotData, updatedArray)
    );
  } catch (error) {
    console.error("Error updating reactions:", error);
    appState.setSnackbarMessage(`Error updating reactions: ${error}`);
  }
};
const Reactions = observer(
  ({
    collectionName,
    target,
    documentRef
  }: {
    collectionName: CollectionName;
    target: StoryDocType | CommentType;
    documentRef: DocumentReference;
  }) => {
    const reactions = target.reactions || [];

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
      await handleReaction(reactionType, {
        documentRef,
        itemId: target.id,
        getArray: (doc) => doc.answers || [],
        updateArray: (_, updated) => ({ answers: updated })
      });
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
          if (target.authorId !== appState.loggedInUser.id) {
            // console.log(
            //   "fake notification",
            sendNotification(
              target.authorId,
              `New reaction on your story`,
              `${myProfileState.user!.firstName} ${
                myProfileState.user!.lastName
              } left a "${reactionType}"`,
              `/profile?notif=my-willemijn-story`
            );
          }
        } catch (error) {
          alert(`Error adding reaction: ${error}`);
          console.error("Error adding reaction:", error);
        }
      }
    };
    const handleCommentReaction = async (reactionType: ReactionName) => {
      const fieldName = collectionName === "qanda" ? "answers" : "comments";
      await handleReaction(reactionType, {
        documentRef,
        itemId: target.id,
        getArray: (doc) => doc[fieldName] || [],
        updateArray: (_, updated) => ({ [fieldName]: updated })
      });

      // was a reaction added or removed?
      const existingReaction = reactions.find(
        (reaction) =>
          reaction.authorId === appState.loggedInUser!.id &&
          reaction.type === reactionType
      );

      let notifyUrl = ``;

      switch (collectionName) {
        case "myWillemijnStories":
          const op = appState.userList.users.find(
            (u) => u.id === documentRef.id
          );
          const opUsername = `${op!.firstName}_${op!.lastName}`;
          notifyUrl = `/profile/${opUsername}`;
          break;
        case "qanda":
          notifyUrl = `/qanda`;
          break;
        case "events":
          notifyUrl = `/events/${documentRef.id}`;
          break;
        default:
          notifyUrl = ``;
          break;
      }

      if (!existingReaction && target.authorId !== appState.loggedInUser!.id) {
        // console.log(
        //   "fake notification",
        sendNotification(
          target.authorId,
          `New reaction on your ${
            collectionName === "qanda" ? "answer" : "comment"
          }`,
          `${myProfileState.user!.firstName} ${
            myProfileState.user!.lastName
          } left a "${reactionType}"`,
          `${notifyUrl}?notif=${target.id}`
        );
      }
    };

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1
          }}
        >
          <ButtonGroup
            variant="text"
            size="small"
            sx={{
              flexWrap: "wrap",
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }}
          >
            {[
              { type: "like", icon: <ThumbUp />, label: "Like" },
              { type: "love", icon: <Favorite />, label: "Love" },
              {
                type: "laugh",
                icon: (
                  <LaughIcon
                    color={
                      !!reactions.find(
                        (reaction: ReactionType) =>
                          reaction.authorId === appState.loggedInUser?.id &&
                          reaction.type === "laugh"
                      )
                    }
                  />
                ),
                label: "Laugh"
              },
              {
                type: "wow",
                icon: (
                  <WowIcon
                    color={
                      !!reactions.find(
                        (reaction: ReactionType) =>
                          reaction.authorId === appState.loggedInUser?.id &&
                          reaction.type === "wow"
                      )
                    }
                  />
                ),
                label: "Wow"
              },
              {
                type: "mindBlown",
                icon: (
                  <MindBlownIcon
                    color={
                      !!reactions.find(
                        (reaction: ReactionType) =>
                          reaction.authorId === appState.loggedInUser?.id &&
                          reaction.type === "mindBlown"
                      )
                    }
                  />
                ),
                label: "Mind Blown"
              }
            ].map(({ type, icon, label }) => {
              const reactionCount = countReactions(type as ReactionName);
              const reactionUsers = getReactionUsers(type as ReactionName);
              const userHasReacted =
                reactions.find(
                  (reaction: ReactionType) =>
                    reaction.authorId === appState.loggedInUser?.id &&
                    reaction.type === type
                ) !== undefined;

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
                      color: userHasReacted
                        ? type === "love"
                          ? "primary.dark"
                          : "warning.main"
                        : "text.secondary",
                      justifyContent: "space-around",
                      "& .MuiButton-startIcon": {
                        marginRight: window.innerWidth < 400 ? "4px" : "8px"
                      }
                    }}
                    className={`answer-${type}`}
                    startIcon={cloneElement(icon, { count: reactionCount })}
                    onClick={() => {
                      if (target.id !== documentRef.id) {
                        handleCommentReaction(type as ReactionName);
                      } else if (collectionName === "myWillemijnStories") {
                        handleStoryReaction(type as ReactionName);
                      } else if (collectionName === "qanda") {
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
