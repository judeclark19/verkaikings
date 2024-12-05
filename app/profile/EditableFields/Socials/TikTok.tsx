import { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { TextField, Typography } from "@mui/material";
import myProfileState from "../../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { EditBtn, SaveBtn } from "../index";
import TikTokIcon from "../../../../public/images/icons8-tiktok-24.svg";

const TikTok = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState(
    myProfileState.tiktok ? myProfileState.tiktok.slice() : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.tiktok === temp) {
      setIsEditing(false);
      return;
    }

    const userDoc = doc(db, "users", myProfileState.userId!);
    setLoading(true);

    updateDoc(userDoc, {
      tiktok: myProfileState.tiktok
    })
      .then(() => {
        setTemp(myProfileState.tiktok || "");
        console.log("TikTok updated successfully");
      })
      .catch((error) => {
        console.error("Error updating TikTok: ", error);
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
      <TikTokIcon
        size={24}
        style={{
          flexShrink: 0
        }}
      />
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
            label="TikTok username"
            variant="outlined"
            fullWidth
            value={myProfileState.tiktok}
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
          {myProfileState.tiktok ? (
            <Link
              href={`https://www.tiktok.com/@${myProfileState.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                flexGrow: 1
              }}
            >
              <Typography component="p">{myProfileState.tiktok}</Typography>
            </Link>
          ) : (
            <Typography
              component="p"
              sx={{
                color: myProfileState.tiktok ? "inherit" : "text.secondary",
                flexGrow: 1
              }}
            >
              (TikTok)
            </Typography>
          )}

          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </div>
  );
});

export default TikTok;
