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
import {
  collection,
  doc,
  DocumentReference,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { sendNotification } from "@/lib/clientUtils";
import { CommentType, QandADocType } from "@/lib/QandAState";

const QandAComments = ({
  qAndA,
  qAndADocRef
}: {
  qAndA: QandADocType;
  qAndADocRef: DocumentReference;
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentType[]>(qAndA.comments || []);

  useEffect(() => {
    if (!qAndA) return;

    const unsubscribe = onSnapshot(qAndADocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const eventData = docSnapshot.data();
        setComments(eventData.comments || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [qAndA.id]);

  if (!qAndA) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText.trim()) {
      if (!appState.loggedInUser) {
        console.error("Must be logged in to comment");
        return;
      }

      // Create a new comment
      const newComment: CommentType = {
        id: doc(collection(db, `qanda/${qAndA.id}/comments`)).id,
        authorId: appState.loggedInUser!.id,
        createdAt: new Date().toISOString(),
        text: commentText
      };

      try {
        await updateDoc(qAndADocRef, {
          comments: [...comments, newComment]
        });

        //   // Send a notification to the story author
        //   if (qAndA.creatorId !== appState.loggedInUser!.id) {
        //     sendNotification(
        //       qAndA.creatorId,
        //       "New comment on your question",
        //       `${myProfileState.user!.firstName} ${
        //         myProfileState.user!.lastName
        //       } left a comment`,
        //       `/qanda?notif=${newComment.id}`
        //     );
        //   }

        setCommentText("");
      } catch (error) {
        alert(`Error adding comment: ${error}`);
        console.error("Error adding comment:", error);
      }
    } else {
      console.log("Comment cannot be empty");
    }
  };

  const handleDelete = async (commentToDelete: CommentType) => {
    console.log("Deleting comment", commentToDelete);
    try {
      const updatedComments = qAndA.comments.filter(
        (comment) => comment.id !== commentToDelete.id
      );

      await updateDoc(qAndADocRef, { comments: updatedComments });
    } catch (error) {
      alert(`Error deleting comment: ${error}`);
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        color="secondary.dark"
        sx={{
          mt: 1
        }}
      >
        Answers
      </Typography>

      {/* Comments List */}
      <List
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
          mb: 2
        }}
      >
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => {
            const commentAuthor = appState.userList.users.find(
              (user) => user.id === comment.authorId
            );
            const isOwnComment = comment.authorId === appState.loggedInUser?.id;

            return (
              <ListItem
                key={index}
                id={comment.id}
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
    </>
  );
};

export default QandAComments;
