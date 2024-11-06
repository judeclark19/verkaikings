import React, { useState } from "react";
import DateOfBirthPicker from "./DateOfBirthPicker";
import { DocumentData } from "firebase/firestore";
import { Typography } from "@mui/material";
import EditFieldBtn from "./EditFieldBtn";
import { formatBirthday } from "@/lib/clientUtils";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";

const DateOfBirth = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  if (!myProfileState.user) {
    return;
  }

  return (
    <>
      {isEditing ? (
        <DateOfBirthPicker label="Birthday" setIsEditing={setIsEditing} />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">
            Birthday:{myProfileState.user.birthday}{" "}
            {formatBirthday(myProfileState.user.birthday)}
          </Typography>
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default DateOfBirth;
