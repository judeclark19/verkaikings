import { EmojiEmotions, Favorite, ThumbUp } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  DocumentData,
  onSnapshot
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import appState from "@/lib/AppState";

type Reaction = {
  authorId: string;
  type: "like" | "love" | "laugh";
  createdAt: string;
};

const StoryReactions = ({ story }: { story: DocumentData }) => {
  const [reactions, setReactions] = useState<Reaction[]>(story.reactions || []);

  useEffect(() => {
    const storyDocRef = doc(db, "myWillemijnStories", story.id);

    const unsubscribe = onSnapshot(storyDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const storyData = docSnapshot.data();
        setReactions(storyData.reactions || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [story.id]);

  const handleReaction = async (reactionType: "like" | "love" | "laugh") => {
    if (!appState.loggedInUser) {
      console.error("User must be logged in to react.");
      return;
    }

    const storyDocRef = doc(db, "myWillemijnStories", story.id);

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
                reactionCount > 0 ? (
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
                ) : (
                  ""
                )
              }
              arrow
              disableHoverListener={reactionCount === 0} // Disable tooltip when no reactions
            >
              <Button
                sx={{
                  px: 1
                }}
                startIcon={icon}
                onClick={() =>
                  handleReaction(type as "like" | "love" | "laugh")
                }
              >
                {reactionCount}
              </Button>
            </Tooltip>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};

export default StoryReactions;
