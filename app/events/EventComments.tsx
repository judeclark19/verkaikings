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
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import myProfileState from "@/app/profile/MyProfile.state";
import { sendNotification } from "@/lib/clientUtils";
import eventsState, { EventDocType } from "./Events.state";

type EventCommentType = {
  id: string;
  authorId: string;
  createdAt: string;
  text: string;
};

const EventComments = ({
  event,
  readOnly = false
}: {
  event?: EventDocType;
  readOnly?: boolean;
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<EventCommentType[]>(
    event?.comments || []
  );
  const eventDocRef = doc(db, "events", event!.id);
  const isPast = event && eventsState.pastEvents.find((e) => e.id === event.id);

  useEffect(() => {
    if (!event) return;

    const unsubscribe = onSnapshot(eventDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const eventData = docSnapshot.data();
        setComments(eventData.comments || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [event?.id]);

  if (!event) return null;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText.trim()) {
      if (!appState.loggedInUser) {
        console.error("Must be logged in to comment");
        return;
      }

      // Create a new comment
      const newComment: EventCommentType = {
        id: doc(collection(db, `events/${event.id}/comments`)).id,
        authorId: appState.loggedInUser!.id,
        createdAt: new Date().toISOString(),
        text: commentText
      };

      try {
        // Update the story document in Firestore
        await updateDoc(eventDocRef, {
          comments: [...comments, newComment]
        });

        // Send a notification to the story author
        if (event.creatorId !== appState.loggedInUser!.id) {
          sendNotification(
            event.creatorId,
            "New comment on your event",
            `${myProfileState.user!.firstName} ${
              myProfileState.user!.lastName
            } left a comment`,
            `/events/${event.id}?notif=${newComment.id}`
          );
        }

        setCommentText("");
      } catch (error) {
        alert(`Error adding comment: ${error}`);
        console.error("Error adding comment:", error);
      }
    } else {
      console.log("Comment cannot be empty");
    }
  };

  const handleDelete = async (commentToDelete: EventCommentType) => {
    try {
      const updatedComments = comments.filter(
        (comment) => comment !== commentToDelete
      );

      await updateDoc(eventDocRef, { comments: updatedComments });
    } catch (error) {
      alert(`Error deleting comment: ${error}`);
      console.error("Error deleting comment:", error);
    }
  };

  if (readOnly && comments.length === 0) {
    return null;
  }

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mt: 0
          }}
        >
          Comments
        </Typography>

        {/* Comments List */}
        <List
          sx={{
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
              const isOwnComment =
                comment.authorId === appState.loggedInUser?.id;

              return (
                <ListItem
                  key={index}
                  id={comment.id || Math.random().toString()}
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

                  {isOwnComment && !isPast && (
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
        {!readOnly && (
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
        )}
      </Box>
    </>
  );
};

export default EventComments;
