import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  List
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import appState from "@/lib/AppState";
import myProfileState from "@/app/profile/MyProfile.state";
import { sendNotification } from "@/lib/clientUtils";
import Comment, { CommentType } from "./Comment";

type Props = {
  featureName: string;
  collectionName: "myWillemijnStories";
  docId: string;
  comments: CommentType[];
  authorId: string;
  label?: string;
  notifyUrl?: string;
  readOnly?: boolean;
};

const CommentAccordion = ({
  featureName,
  collectionName,
  docId,
  comments: initialComments,
  authorId,
  label = "Comments",
  notifyUrl = "",
  readOnly = false
}: Props) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentType[]>(
    initialComments || []
  );
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const docRef = doc(db, collectionName, docId);
  console.log("docRef", docRef);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setComments(snapshot.data().comments || []);
      }
    });
    return unsubscribe;
  }, [collectionName, docId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentType = {
      id: doc(collection(db, `${collectionName}/${docId}/comments`)).id,
      authorId: appState.loggedInUser!.id,
      createdAt: new Date().toISOString(),
      text: commentText.trim(),
      reactions: []
    };

    setLoading(true);
    try {
      await updateDoc(docRef, {
        comments: [...comments, newComment]
      });

      // if (authorId !== appState.loggedInUser!.id) {
      //   sendNotification(
      //     authorId,
      //     `New ${label.toLowerCase().slice(0, -1)} on your post`,
      //     `${myProfileState.user!.firstName} ${
      //       myProfileState.user!.lastName
      //     } left a ${label.toLowerCase().slice(0, -1)}`,
      //     `${notifyUrl}?notif=${newComment.id}`
      //   );
      // }

      console.log("fake send notification", {
        recipientId: authorId,
        title: `New comment on your post`,
        body: `${myProfileState.user!.firstName} ${
          myProfileState.user!.lastName
        } left a comment on your ${featureName}`,
        url: `${notifyUrl}?notif=${newComment.id}`
      });

      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toDelete: CommentType) => {
    const updated = comments.filter((c) => c.id !== toDelete.id);
    await updateDoc(docRef, { comments: updated });
  };

  const handleEdit = async (commentId: string, newText: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, text: newText } : c
    );
    await updateDoc(docRef, { comments: updated });
  };

  const renderedComments = (
    <List
      sx={{
        bgcolor: "transparent",
        padding: 0,
        mb: 2
      }}
    >
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Box
            key={comment.id || comment.createdAt}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              p: 2,
              mb: 2
            }}
          >
            <Comment
              comment={comment}
              parentDocRef={docRef}
              collectionName={collectionName}
              onDelete={handleDelete}
              onEdit={(text) => handleEdit(comment.id, text)}
              readOnly={readOnly}
            />
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ px: 2 }}>
          No {label.toLowerCase()} yet.
        </Typography>
      )}
    </List>
  );

  return (
    <Box sx={{ mt: 4 }}>
      {comments.length > 3 ? (
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h4" sx={{ m: 0 }}>
              {comments.length} {label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderedComments}</AccordionDetails>
        </Accordion>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {renderedComments}
        </>
      )}

      {!readOnly && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder={`Write a ${label.toLowerCase().slice(0, -1)}...`}
              fullWidth
              variant="outlined"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{ height: 40 }}
              disabled={!commentText.trim() || loading}
            >
              {loading ? <CircularProgress size={20} /> : "Post"}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default CommentAccordion;
