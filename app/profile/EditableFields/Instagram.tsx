import { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { CircularProgress, Fab, TextField, Typography } from "@mui/material";
import myProfileState from "../MyProfile.state";
import EditIcon from "@mui/icons-material/Edit";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import SaveIcon from "@mui/icons-material/Save";

const Instagram = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState(
    myProfileState.instagram ? myProfileState.instagram.slice() : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.instagram === temp) {
      setIsEditing(false);
      return;
    }

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
          <Fab
            type="submit"
            color="secondary"
            size="medium"
            aria-label="save"
            sx={{
              flexShrink: 0
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              <SaveIcon />
            )}
          </Fab>
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
            {myProfileState.instagram ? (
              <Link
                href={`https://www.instagram.com/${myProfileState.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "inherit",
                  display: "flex",
                  gap: "0.5rem"
                }}
              >
                <InstagramIcon /> {myProfileState.instagram}
              </Link>
            ) : (
              <InstagramIcon />
            )}
          </Typography>
          <Fab
            size="medium"
            color="secondary"
            aria-label="edit"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <EditIcon />
          </Fab>
        </div>
      )}
    </>
  );
});

export default Instagram;
