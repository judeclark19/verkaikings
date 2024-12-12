import appState from "@/lib/AppState";
import { db } from "@/lib/firebase";
import {
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography,
  Link,
  IconButton
} from "@mui/material";
import { doc, DocumentData, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

type Comment = {
  authorId: string;
  createdAt: string;
  text: string;
};

const StoryComments = ({ story }: { story?: DocumentData }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(story?.comments || []);

  useEffect(() => {
    if (!story) return;
    const storyDocRef = doc(db, "myWillemijnStories", story.id);

    const unsubscribe = onSnapshot(storyDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const storyData = docSnapshot.data();
        setComments(storyData.comments || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [story?.id]);

  if (!story) return null;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commentText.trim()) {
      if (!appState.loggedInUser) {
        console.error("Must be logged in to comment");
        return;
      }

      // Create a new comment
      const newComment: Comment = {
        authorId: appState.loggedInUser!.id,
        createdAt: new Date().toISOString(),
        text: commentText
      };

      try {
        // Update the story document in Firestore
        const storyDocRef = doc(db, "myWillemijnStories", story.id);
        await updateDoc(storyDocRef, {
          comments: [...comments, newComment]
        });

        setCommentText(""); // Clear the input
      } catch (error) {
        alert(`Error adding comment: ${error}`);
        console.error("Error adding comment:", error);
      }
    } else {
      console.log("Comment cannot be empty");
    }
  };

  const handleDelete = async (commentToDelete: Comment) => {
    try {
      // Update the story document in Firestore
      const storyDocRef = doc(db, "myWillemijnStories", story.id);
      const updatedComments = comments.filter(
        (comment) => comment !== commentToDelete
      );

      await updateDoc(storyDocRef, { comments: updatedComments });
    } catch (error) {
      alert(`Error deleting comment: ${error}`);
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Comments
      </Typography>

      {/* Comments List */}
      <List
        sx={{
          maxHeight: 200,
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
          mb: 2
        }}
      >
        {comments.length > 0 ? (
          comments.map((comment, index) => {
            const commentAuthor = appState.userList.users.find(
              (user) => user.id === comment.authorId
            );
            const isOwnComment = comment.authorId === appState.loggedInUser?.id;

            return (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  mb: 1,
                  position: "relative"
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  <Link
                    href={`/profile/${commentAuthor?.username || "#"}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        textDecoration: "underline"
                      }
                    }}
                  >
                    {commentAuthor?.firstName} {commentAuthor?.lastName}
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 12, color: "gray" }}
                >
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {comment.text}
                </Typography>

                {isOwnComment && (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDelete(comment)}
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
              </ListItem>
            );
          })
        ) : (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              px: 2
            }}
          >
            No comments yet.
          </Typography>
        )}
      </List>

      {/* Add New Comment */}
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
            placeholder="Write a comment..."
            fullWidth
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              height: 40
            }}
            disabled={!commentText.trim()} // Disable button if input is empty
          >
            Post
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default StoryComments;
