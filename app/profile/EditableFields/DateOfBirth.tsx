import React, { useState } from "react";
import DateOfBirthPicker from "./DateOfBirthPicker";
import { Typography } from "@mui/material";
import { checkIfBirthdayToday, formatFullBirthday } from "@/lib/clientUtils";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import EditBtn from "./EditBtn";
import CakeIcon from "@mui/icons-material/Cake";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <CakeIcon />
          {isEditing ? (
            <div>
              <DateOfBirthPicker label="Birthday" setIsEditing={setIsEditing} />
            </div>
          ) : (
            <Typography
              component="p"
              sx={{
                color: myProfileState.user.birthday
                  ? "inherit"
                  : "text.secondary"
              }}
            >
              {myProfileState.user.birthday
                ? birthdayText(myProfileState.user.birthday)
                : "(Enter your date of birth)"}{" "}
              {checkIfBirthdayToday(myProfileState.user.birthday) && "🎂"}
            </Typography>
          )}
        </div>
        {!isEditing && <EditBtn setIsEditing={setIsEditing} />}
      </div>
    </>
  );
});

export default DateOfBirth;
