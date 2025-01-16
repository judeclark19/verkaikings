import { EditBtn } from "@/app/profile/EditableFields";
import {
  Box,
  CircularProgress,
  Fab,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import fundraiserState from "@/lib/FundraiserState";
import { observer } from "mobx-react-lite";

const Description = observer(() => {
  const description = fundraiserState.activeFundraiser?.description;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState(description || "");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <TextField
          label={`Description for ${fundraiserState.activeFundraiser?.title}`}
          multiline
          rows={3}
          fullWidth
          value={textFieldValue}
          onChange={(e) => setTextFieldValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          variant="outlined"
        />
      ) : (
        <Typography
          sx={{
            padding: "16px 14px",
            color: fundraiserState.activeFundraiser?.description
              ? "text.primary"
              : "text.secondary",
            fontStyle: description ? "normal" : "italic",
            height: "102px"
          }}
        >
          {description ? description : "(No description)"}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2
        }}
      >
        {isEditing ? (
          <Fab
            onClick={handleSubmit}
            color="secondary"
            size="small"
            aria-label="save"
            sx={{
              flexShrink: 0
            }}
          >
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              <SaveIcon />
            )}
          </Fab>
        ) : (
          <EditBtn setIsEditing={setIsEditing} />
        )}
      </Box>
    </>
  );
});

export default Description;
