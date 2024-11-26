import React, { useState } from "react";
import DateOfBirthPicker from "./DateOfBirthPicker";
import { Typography } from "@mui/material";
import { checkIfBirthdayToday, formatFullBirthday } from "@/lib/clientUtils";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import EditBtn from "./EditBtn";

const DateOfBirth = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  if (!myProfileState.user) {
    return;
  }

  const birthdayText = (birthday: string) => {
    return `${birthday} / ${formatFullBirthday(birthday)}`;
  };

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
            Birthday:{" "}
            {myProfileState.user.birthday
              ? birthdayText(myProfileState.user.birthday)
              : ""}{" "}
            {checkIfBirthdayToday(myProfileState.user.birthday) && "🎂"}
          </Typography>
          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default DateOfBirth;
