import { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { TextField, Typography } from "@mui/material";
import myProfileState from "../../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { EditBtn, SaveBtn } from "../index";

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
    <div
      style={{
        height: "76px",
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}
    >
      <InstagramIcon />
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
            label="Instagram username"
            variant="outlined"
            fullWidth
            value={myProfileState.instagram}
            onChange={(e) => {
              myProfileState.setInstagram(e.target.value);
            }}
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
          <SaveBtn loading={loading} />
        </form>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexGrow: 1
          }}
        >
          {myProfileState.instagram ? (
            <Link
              href={`https://www.instagram.com/${myProfileState.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                flexGrow: 1
              }}
            >
              <Typography component="p">{myProfileState.instagram}</Typography>
            </Link>
          ) : (
            <Typography
              component="p"
              sx={{
                color: myProfileState.instagram ? "inherit" : "text.secondary",
                flexGrow: 1
              }}
            >
              (Instagram)
            </Typography>
          )}

          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </div>
  );
});

export default Instagram;
