import { observer } from "mobx-react-lite";
import { CommentType } from "../Comment";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import appState from "@/lib/AppState";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  setDoc
} from "firebase/firestore";
import { CollectionName, db } from "@/lib/firebase";
import Reply from "./Reply";

export type ReplyType = {
  id: string;
  authorId: string;
  createdAt: string;
  text: string;
};

const CommentReplies = observer(
  ({
    comment,
    collectionName,
    parentDocRef,
    readOnly = false
  }: {
    comment: CommentType;
    collectionName: CollectionName;
    parentDocRef: DocumentReference;
    readOnly?: boolean;
  }) => {
    const replies = comment.replies || [];

    const [replyText, setReplyText] = useState("");

    const handleSubmitReply = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim()) return;

      if (!appState.loggedInUser) {
        console.error("User not logged in");
        return;
      }

      const newReply: ReplyType = {
        id: doc(
          collection(
            db,
            `${collectionName}/${parentDocRef.id}/comments/${comment.id}/replies`
          )
        ).id,
        authorId: appState.loggedInUser?.id,
        createdAt: new Date().toISOString(),
        text: replyText.trim()
      };

      // if (newReply.authorId !== comment.authorId) {
      console.log("send fake notification to", comment.authorId, newReply);
      // }

      try {
        const parentSnapshot = await getDoc(parentDocRef);
        const parentData = parentSnapshot.data();
        const fieldName = collectionName === "qanda" ? "answers" : "comments";
        const updatedComments =
          parentData?.[fieldName]?.map((c: CommentType) =>
            c.id === comment.id
              ? {
                  ...c,
                  replies: [...(c.replies || []), newReply]
                }
              : c
          ) || [];

        await setDoc(
          parentDocRef,
          { [fieldName]: updatedComments },
          { merge: true }
        );

        console.log("send reply notification to", comment.authorId, newReply);

        setReplyText("");
      } catch (err) {
        console.error("Failed to update document with reply:", err);
        appState.setSnackbarMessage("Failed to update document with reply");
      }
    };

    return (
      <Box
        sx={{
          width: "100%",
          pl: {
            xs: 1,
            sm: 2
          }
        }}
      >
        {replies.length > 0 && (
          <>
            {replies.map((reply) => (
              <Box
                key={reply.id}
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <ReplyIcon
                  fontSize="small"
                  sx={{ mr: 1, mt: 1, transform: "rotate(180deg)" }}
                />
                <Reply
                  reply={reply}
                  commentId={comment.id}
                  parentDocRef={parentDocRef}
                  key={reply.id}
                  readOnly={readOnly}
                />
              </Box>
            ))}
          </>
        )}

        {!readOnly && (
          <Box
            component="form"
            onSubmit={handleSubmitReply}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              pl: replies.length > 0 ? 3 : 0,
              width: "100%"
            }}
          >
            {replies.length === 0 && (
              <ReplyIcon
                fontSize="small"
                sx={{ transform: "rotate(180deg)" }}
              />
            )}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Write a reply..."
              fullWidth
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={!replyText.trim()}
              sx={{ height: "40px" }}
            >
              Reply
            </Button>
          </Box>
        )}
      </Box>
    );
  }
);

export default CommentReplies;
