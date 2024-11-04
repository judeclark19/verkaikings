import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import { useState } from "react";
import EditFieldBtn from "./EditFieldBtn";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MyWillemijnStory = observer(({ userId }: { userId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDoc = doc(db, "users", userId);
  const [temp, setTemp] = useState(
    myProfileState.myWillemijnStory
      ? myProfileState.myWillemijnStory.slice()
      : ""
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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
          <Button
            variant="outlined"
            onClick={() => {
              myProfileState.setMyWillemijnStory(temp);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
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
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default MyWillemijnStory;
