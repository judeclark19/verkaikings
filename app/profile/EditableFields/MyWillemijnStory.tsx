import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import { useState } from "react";
import {
  Box,
  Fab,
  CircularProgress,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditBtn } from ".";
import appState from "@/lib/AppState";
import StoryComments from "@/app/people/ByStory/StoryComments";
import SaveIcon from "@mui/icons-material/Save";
import Reactions from "@/components/Reactions/Reactions";
import CommentAccordion from "@/components/Comments/CommentAccordion";

const MyWillemijnStory = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const mws = appState.myWillemijnStories.allStories.find(
    (story) => story.authorId === myProfileState.userId
  );
  const [temp, setTemp] = useState(
    myProfileState.myWillemijnStory
      ? myProfileState.myWillemijnStory.slice()
      : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.myWillemijnStory === temp) {
      setIsEditing(false);
      return;
    }

    setLoading(true);

    try {
      if (mws) {
        // If the story exists, update it
        const mwsDocRef = doc(db, "myWillemijnStories", mws.id);
        await updateDoc(mwsDocRef, {
          storyContent: myProfileState.myWillemijnStory || "",
          updatedAt: new Date().toISOString()
        });
        appState.setSnackbarMessage("MyWillemijnStory updated successfully.");
      } else {
        // If no story exists, create a new one
        const newStoryDocRef = doc(
          db,
          "myWillemijnStories",
          myProfileState.userId!
        );
        await setDoc(newStoryDocRef, {
          authorId: myProfileState.userId,
          storyContent: myProfileState.myWillemijnStory || "",
          createdAt: new Date().toISOString(),
          comments: [],
          reactions: []
        });
        console.log("MyWillemijnStory created successfully.");
      }

      // Update local state after successful update
      setTemp(myProfileState.myWillemijnStory || "");
    } catch (error) {
      alert(`Error updating or creating MyWillemijnStory: ${error}`);
      console.error("Error updating or creating MyWillemijnStory: ", error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <Typography variant="h2" id="my-willemijn-story">
        My Willemijn Story
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h4">
          How did you first become a fan of Willemijn?
        </Typography>
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

      {isEditing ? (
        <TextField
          sx={{ mb: 1 }}
          label="My Willemijn Story"
          multiline
          rows={10}
          fullWidth
          value={myProfileState.myWillemijnStory}
          onChange={(e) => myProfileState.setMyWillemijnStory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          variant="outlined"
        />
      ) : (
        <Paper sx={{ mb: 2 }}>
          <Typography
            sx={{
              minHeight: "125px",
              padding: "16px 14px",
              color: myProfileState.myWillemijnStory
                ? "text.primary"
                : "text.secondary",
              fontStyle: myProfileState.myWillemijnStory ? "normal" : "italic"
            }}
          >
            {myProfileState.myWillemijnStory
              ? myProfileState.myWillemijnStory
              : "(Click the edit button above to add your story)"}
          </Typography>
        </Paper>
      )}

      {mws && mws.storyContent && (
        <Reactions
          collectionName="myWillemijnStories"
          target={mws}
          documentRef={doc(db, "myWillemijnStories", mws.id)}
        />
      )}
      {/* {mws && mws.storyContent && <StoryComments story={mws} />} */}

      {mws && mws.storyContent && (
        <CommentAccordion
          featureName="story"
          collectionName="myWillemijnStories"
          docId={mws.id}
          comments={mws.comments}
          authorId={mws.authorId}
          label="Comments"
          notifyUrl="/profile"
          readOnly={false}
        />
      )}
    </>
  );
});

export default MyWillemijnStory;
