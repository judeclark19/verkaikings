import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Link
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import appState from "@/lib/AppState";

export type CommentType = {
  id: string;
  authorId: string;
  createdAt: string;
  text: string;
};

type Props = {
  comment: CommentType;
  onDelete?: (comment: CommentType) => void;
  onEdit?: (updatedText: string) => void;
  readOnly?: boolean;
};

const Comment = ({ comment, onDelete, onEdit, readOnly }: Props) => {
  const user = appState.userList.users.find((u) => u.id === comment.authorId);
  const isOwn = comment.authorId === appState.loggedInUser?.id;

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [loading, setLoading] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && text.trim() !== comment.text) {
      setLoading(true);
      await onEdit?.(text.trim());
      setEditing(false);
      setLoading(false);
    } else {
      setEditing(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative"
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        <Link
          href={`/profile/${user?.username || "#"}`}
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": { textDecoration: "underline" }
          }}
        >
          {user?.firstName} {user?.lastName}
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12, color: "gray" }}>
        {new Date(comment.createdAt).toLocaleString()}
      </Typography>

      {editing ? (
        <Box
          component="form"
          onSubmit={handleEditSubmit}
          sx={{ mt: 1, width: "100%", display: "flex", gap: 1 }}
        >
          <TextField
            fullWidth
            size="small"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="submit"
            variant="outlined"
            size="small"
            sx={{ minWidth: 40 }}
          >
            {loading ? <CircularProgress size={18} /> : <SaveIcon />}
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {comment.text}
        </Typography>
      )}

      {isOwn && !readOnly && (
        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          {!editing && (
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => onDelete?.(comment)}
            sx={{ color: "red" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default Comment;
