import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditBtn, SaveBtn } from ".";

const MyWillemijnStory = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDoc = doc(db, "users", myProfileState.userId!);
  const [temp, setTemp] = useState(
    myProfileState.myWillemijnStory
      ? myProfileState.myWillemijnStory.slice()
      : ""
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.myWillemijnStory === temp) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    updateDoc(userDoc, {
      myWillemijnStory: myProfileState.myWillemijnStory
    })
      .then(() => {
        setTemp(myProfileState.myWillemijnStory || "");
        console.log("MyWillemijnStory updated");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      })
      .finally(() => {
        setLoading(false);
        setIsEditing(false);
      });
  };

  return (
    <>
      <Typography variant="h2">My Willemijn Story</Typography>
      {isEditing ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: "500px"
          }}
        >
          <Typography variant="caption">
            How did you first become a fan of Willemijn?
          </Typography>
          <TextField
            label="My Willemijn Story"
            multiline
            rows={4}
            fullWidth
            value={myProfileState.myWillemijnStory}
            onChange={(e) => myProfileState.setMyWillemijnStory(e.target.value)}
            variant="outlined"
          />
          {/* <Button
            variant="outlined"
            onClick={() => {
              myProfileState.setMyWillemijnStory(temp);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button> */}
          <SaveBtn loading={loading} />
        </Box>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <p>{myProfileState.myWillemijnStory}</p>
          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default MyWillemijnStory;
