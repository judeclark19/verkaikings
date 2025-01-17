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
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import appState from "@/lib/AppState";

const Description = observer(() => {
  const description = fundraiserState.activeFundraiser?.description;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState(description || "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (textFieldValue !== description) {
      try {
        setLoading(true);
        const fundraiserDocRef = doc(
          db,
          "fundraisers",
          fundraiserState.activeFundraiser!.id
        );
        await updateDoc(fundraiserDocRef, {
          description: textFieldValue,
          updatedAt: new Date().toISOString()
        });
        fundraiserState.setActiveFundraiserDescription(textFieldValue);
        appState.setSnackbarMessage("Description updated successfully.");
      } catch (error) {
        alert(`Error updating or creating description: ${error}`);
        console.error("Error updating or creating description: ", error);
      } finally {
        setLoading(false);
        setIsEditing(false);
      }
    }
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
          sx={{
            "& .MuiInputBase-input": {
              resize: "vertical",
              height: "auto"
            },
            "& textarea": {
              overflow: "auto"
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
            height: "102px",
            whiteSpace: "pre-line"
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
