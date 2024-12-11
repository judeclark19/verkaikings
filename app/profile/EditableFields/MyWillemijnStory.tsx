import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import { useState } from "react";
import { Box, Paper, TextField, Typography } from "@mui/material";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditBtn, SaveBtn } from ".";
import appState from "@/lib/AppState";

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
      // Find the myWillemijnStory for the current user
      const mws = appState.myWillemijnStories.allStories.find(
        (story) => story.authorId === myProfileState.userId
      );

      if (mws) {
        // If the story exists, update it
        const mwsDocRef = doc(db, "myWillemijnStories", mws.id);
        await updateDoc(mwsDocRef, {
          storyContent: myProfileState.myWillemijnStory || "",
          updatedAt: new Date().toISOString()
        });
        console.log("MyWillemijnStory updated successfully.");
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
      console.error("Error updating or creating MyWillemijnStory: ", error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <Typography variant="h2">My Willemijn Story</Typography>
      <Typography variant="h4">
        How did you first become a fan of Willemijn?
      </Typography>
      {isEditing ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <TextField
            label="My Willemijn Story"
            multiline
            rows={4}
            fullWidth
            value={myProfileState.myWillemijnStory}
            onChange={(e) => myProfileState.setMyWillemijnStory(e.target.value)}
            variant="outlined"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <SaveBtn loading={loading} />
          </div>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Paper>
            <Typography
              sx={{
                minHeight: "125px",
                padding: "16px 14px"
              }}
            >
              {myProfileState.myWillemijnStory}
            </Typography>
          </Paper>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "24px"
            }}
          >
            <EditBtn setIsEditing={setIsEditing} />
          </div>
        </Box>
      )}
    </>
  );
});

export default MyWillemijnStory;
