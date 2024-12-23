import { EmojiEmotions, Favorite, ThumbUp } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  DocumentData,
  onSnapshot,
  DocumentReference
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import appState from "@/lib/AppState";
import myProfileState from "@/app/profile/MyProfile.state";
import { sendNotification } from "@/lib/clientUtils";

type Reaction = {
  authorId: string;
  type: "like" | "love" | "laugh";
  createdAt: string;
};

const StoryReactions = ({ story }: { story?: DocumentData }) => {
  const [reactions, setReactions] = useState<Reaction[]>(
    story?.reactions || []
  );

  let storyDocRef: DocumentReference;
  if (story) {
    storyDocRef = doc(db, "myWillemijnStories", story.id);
  }

  useEffect(() => {
    if (!story) return;

    const unsubscribe = onSnapshot(storyDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const storyData = docSnapshot.data();
        setReactions(storyData.reactions || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [story?.id]);

  if (!story) return null;

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

    if (existingReaction) {
      try {
        await updateDoc(storyDocRef, {
          reactions: arrayRemove(existingReaction)
        });
      } catch (error) {
        alert(`Error removing reaction: ${error}`);
        console.error("Error removing reaction:", error);
      }
    } else {
      // Add the reaction
      const newReaction: Reaction = {
        authorId: appState.loggedInUser.id,
        type: reactionType,
        createdAt: new Date().toISOString()
      };

      try {
        await updateDoc(storyDocRef, {
          reactions: arrayUnion(newReaction)
        });

        // send a notification to the author of the story

        if (story.authorId !== appState.loggedInUser.id) {
          sendNotification(
            story.authorId,
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

  const countReactions = (type: "like" | "love" | "laugh") =>
    reactions.filter((reaction: Reaction) => reaction.type === type).length;

  const getReactionUsers = (type: "like" | "love" | "laugh") =>
    reactions
      .filter((reaction) => reaction.type === type)
      .map((reaction) => {
        const user = appState.userList.users.find(
          (u) => u.id === reaction.authorId
        );
        return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
      });

  return (
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
              arrow
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
                id={`story-${type}`}
                startIcon={icon}
                onClick={() =>
                  handleReaction(type as "like" | "love" | "laugh")
                }
              >
                <Typography
                  sx={{
                    color: reactionCount > 0 ? "text.primary" : "text.secondary" // Reaction count color
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
  );
};

export default StoryReactions;
