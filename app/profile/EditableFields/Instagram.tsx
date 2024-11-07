import { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import myProfileState from "../MyProfile.state";
import EditFieldBtn from "./EditFieldBtn";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Instagram = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState(
    myProfileState.instagram ? myProfileState.instagram.slice() : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userDoc = doc(db, "users", myProfileState.userId!);
    setLoading(true);

    updateDoc(userDoc, {
      instagram: myProfileState.instagram
    })
      .then(() => {
        setTemp(myProfileState.instagram || "");
        console.log("Instagram updated successfully");
      })
      .catch((error) => {
        console.error("Error updating Instagram: ", error);
      })
      .finally(() => {
        setLoading(false);
        setIsEditing(false);
      });
  };

  return (
    <>
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <TextField
            label="Enter your Instagram username"
            variant="outlined"
            fullWidth
            value={myProfileState.instagram}
            onChange={(e) => {
              myProfileState.setInstagram(e.target.value);
            }}
            sx={{ margin: "10px 0", width: "300px", maxWidth: "100%" }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              myProfileState.setInstagram(temp);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">
            <InstagramIcon /> {myProfileState.instagram}
          </Typography>
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default Instagram;
