import { useState } from "react";
import { TextField, Typography } from "@mui/material";
import myProfileState from "../../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import DuolingoIcon from "../../../../public/images/icons8-duolingo-24.svg";
import { EditBtn, SaveBtn } from "../index";

const Duolingo = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState(
    myProfileState.duolingo ? myProfileState.duolingo.slice() : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.duolingo === temp) {
      setIsEditing(false);
      return;
    }

    const userDoc = doc(db, "users", myProfileState.userId!);
    setLoading(true);

    updateDoc(userDoc, {
      duolingo: myProfileState.duolingo
    })
      .then(() => {
        setTemp(myProfileState.duolingo || "");
        console.log("Duolingo updated successfully");
      })
      .catch((error) => {
        console.error("Error updating Duolingo: ", error);
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
      <DuolingoIcon
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
            label="Duolingo username"
            variant="outlined"
            fullWidth
            value={myProfileState.duolingo}
            onChange={(e) => {
              myProfileState.setDuolingo(e.target.value);
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
          {myProfileState.duolingo ? (
            <Link
              href={`https://www.duolingo.com/profile/${myProfileState.duolingo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                flexGrow: 1
              }}
            >
              <Typography component="p">{myProfileState.duolingo}</Typography>
            </Link>
          ) : (
            <Typography
              component="p"
              sx={{
                color: myProfileState.duolingo ? "inherit" : "text.secondary",
                flexGrow: 1
              }}
            >
              (Duolingo)
            </Typography>
          )}

          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </div>
  );
});

export default Duolingo;
