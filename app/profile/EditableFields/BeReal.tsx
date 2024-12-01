import { useState } from "react";
import { TextField, Typography } from "@mui/material";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SaveBtn from "./SaveBtn";
import BeRealIcon from "../../../public/images/icons8-bereal-24.svg";
import EditBtn from "./EditBtn";

const BeReal = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState(
    myProfileState.beReal ? myProfileState.beReal.slice() : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (myProfileState.beReal === temp) {
      setIsEditing(false);
      return;
    }

    const userDoc = doc(db, "users", myProfileState.userId!);
    setLoading(true);

    updateDoc(userDoc, {
      beReal: myProfileState.beReal || null
    })
      .then(() => {
        setTemp(myProfileState.beReal || "");
        console.log("BeReal updated successfully");
      })
      .catch((error) => {
        console.error("Error updating BeReal: ", error);
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
      <BeRealIcon
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
            label="Enter your BeReal username"
            variant="outlined"
            fullWidth
            value={myProfileState.beReal}
            onChange={(e) => {
              myProfileState.setBeReal(e.target.value);
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
              color: myProfileState.beReal ? "inherit" : "text.secondary",
              flexGrow: 1
            }}
          >
            {myProfileState.beReal || "(Enter your BeReal username)"}
          </Typography>

          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </div>
  );
});

export default BeReal;
