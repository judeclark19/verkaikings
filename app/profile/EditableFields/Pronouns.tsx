import { useState } from "react";
import { TextField, Typography } from "@mui/material";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SaveBtn from "./SaveBtn";
import { FaTransgender } from "react-icons/fa";
import EditBtn from "./EditBtn";

const Pronouns = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState(
    myProfileState.pronouns ? myProfileState.pronouns.slice() : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.pronouns === temp) {
      setIsEditing(false);
      return;
    }

    const userDoc = doc(db, "users", myProfileState.userId!);
    setLoading(true);

    updateDoc(userDoc, {
      pronouns: myProfileState.pronouns || null
    })
      .then(() => {
        setTemp(myProfileState.pronouns || "");
        console.log("Pronouns updated successfully");
      })
      .catch((error) => {
        console.error("Error updating Pronouns: ", error);
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
      <FaTransgender
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
            gap: "1rem",
            flexGrow: 1
          }}
        >
          <TextField
            label="Enter your Pronouns username"
            variant="outlined"
            fullWidth
            value={myProfileState.pronouns || ""}
            onChange={(e) => {
              myProfileState.setPronouns(e.target.value);
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
          <Typography
            component="p"
            sx={{
              color: myProfileState.pronouns ? "inherit" : "text.secondary",
              flexGrow: 1
            }}
          >
            {myProfileState.pronouns || "(Enter your pronouns)"}
          </Typography>

          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </div>
  );
});

export default Pronouns;
