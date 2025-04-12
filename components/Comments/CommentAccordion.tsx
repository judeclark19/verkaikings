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
import { CollectionName, db } from "@/lib/firebase";
import appState from "@/lib/AppState";
import myProfileState from "@/app/profile/MyProfile.state";
import { sendNotification } from "@/lib/clientUtils";
import Comment, { CommentType } from "./Comment";

type Props = {
  featureName: string;
  collectionName: CollectionName;
  docId: string;
  comments: CommentType[];
  authorId: string;
  label?: string;
  notifyUrl?: string;
  readOnly?: boolean;
  startExpanded?: boolean;
};

const CommentAccordion = ({
  featureName,
  collectionName,
  docId,
  comments: initialComments,
  authorId,
  label = "Comments",
  notifyUrl = "",
  readOnly = false,
  startExpanded = false
}: Props) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentType[]>(
    initialComments || []
  );

  const [expanded, setExpanded] = useState(startExpanded);
  const [loading, setLoading] = useState(false);

  const docRef = doc(db, collectionName, docId);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Use 'answers' for qanda docs; fallback to 'comments' otherwise
        const commentsField =
          collectionName === "qanda" ? data.answers : data.comments;
        setComments(commentsField || []);
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
      reactions: [],
      replies: []
    };

    const fieldName = collectionName === "qanda" ? "answers" : "comments";

    setLoading(true);
    try {
      await updateDoc(docRef, {
        [fieldName]: [...comments, newComment]
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
    const fieldName = collectionName === "qanda" ? "answers" : "comments";
    await updateDoc(docRef, { [fieldName]: updated });
  };

  const handleEdit = async (commentId: string, newText: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, text: newText } : c
    );
    const fieldName = collectionName === "qanda" ? "answers" : "comments";
    await updateDoc(docRef, { [fieldName]: updated });
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
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            mb: 2
          }}
        >
          <Typography variant="body2" color="textSecondary">
            No {label.toLowerCase()} yet.
          </Typography>
        </Box>
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
