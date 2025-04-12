import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Link,
  CircularProgress
} from "@mui/material";
import { ReplyType } from "./CommentReplies";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import { useState } from "react";
import { getDoc, setDoc, DocumentReference } from "firebase/firestore";
import { apps } from "firebase-admin";

const Reply = observer(
  ({
    reply,
    commentId,
    parentDocRef,
    readOnly = false
  }: {
    reply: ReplyType;
    commentId: string;
    parentDocRef: DocumentReference;
    readOnly?: boolean;
  }) => {
    const isOwn = reply.authorId === appState.loggedInUser?.id;

    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(reply.text);
    const [loading, setLoading] = useState(false);

    const handleSubmitEdit = async () => {
      setLoading(true);
      if (inputValue === reply.text) {
        setEditing(false);
        return;
      }

      try {
        const parentSnapshot = await getDoc(parentDocRef);
        const parentData = parentSnapshot.data();
        const collectionName = parentDocRef.parent.id;
        const fieldName = collectionName === "qanda" ? "answers" : "comments";

        const updatedComments = parentData?.[fieldName]?.map((comment: any) => {
          if (comment.id === commentId) {
            const updatedReplies = (comment.replies || []).map((r: ReplyType) =>
              r.id === reply.id ? { ...r, text: inputValue } : r
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });

        await setDoc(
          parentDocRef,
          { [fieldName]: updatedComments },
          { merge: true }
        );

        console.log("Reply updated:", reply.id);
      } catch (error) {
        console.error("Error updating reply text:", error);
      }

      setEditing(false);
      setLoading(false);
    };

    const handleDelete = async () => {
      try {
        const parentSnapshot = await getDoc(parentDocRef);
        const parentData = parentSnapshot.data();
        const collectionName = parentDocRef.parent.id;
        const fieldName = collectionName === "qanda" ? "answers" : "comments";

        const updatedComments = parentData?.[fieldName]?.map((comment: any) => {
          if (comment.id === commentId) {
            const updatedReplies = (comment.replies || []).filter(
              (r: ReplyType) => r.id !== reply.id
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });

        await setDoc(
          parentDocRef,
          { [fieldName]: updatedComments },
          { merge: true }
        );

        appState.setSnackbarMessage("Reply deleted.");
      } catch (error) {
        console.error("Error deleting reply:", error);
      }
    };

    return (
      <Box
        id={reply.id}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 1,
          padding: 1,
          borderRadius: 1,
          backgroundColor: "#1A1A1A",
          width: "100%"
        }}
      >
        {editing && (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitEdit();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%"
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
            />
            <IconButton
              type="submit"
              size="small"
              disabled={reply.text.trim() === ""}
            >
              {loading ? (
                <CircularProgress size={18} />
              ) : (
                <SaveIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        )}
        {!editing && (
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.85rem", color: "text.secondary" }}
            >
              <Link
                href={`/profile/${
                  appState.userList.users.find((u) => u.id === reply.authorId)
                    ?.username || "#"
                }`}
                sx={{
                  fontWeight: "bold",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {
                  appState.userList.users.find((u) => u.id === reply.authorId)
                    ?.firstName
                }{" "}
                {
                  appState.userList.users.find((u) => u.id === reply.authorId)
                    ?.lastName
                }
              </Link>{" "}
              • {new Date(reply.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {reply.text}
            </Typography>
          </Box>
        )}

        {isOwn && !readOnly && !editing && (
          <Box
            sx={{
              width: { xs: "min-content", sm: "auto" }
            }}
          >
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>{" "}
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{ color: "red" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }
);

export default Reply;
