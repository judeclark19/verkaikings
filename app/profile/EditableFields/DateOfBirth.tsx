import React, { useState } from "react";
import DateOfBirthPicker from "../DateOfBirthPicker";
import { DocumentData } from "firebase/firestore";
import { Typography } from "@mui/material";
import EditFieldBtn from "./EditFieldBtn";
import { formatBirthday } from "@/lib/clientUtils";

function DateOfBirth({
  user,
  userId,
  setUser
}: {
  user: DocumentData;
  userId: string;
  setUser: (user: DocumentData) => void;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <>
      {isEditing ? (
        <DateOfBirthPicker
          label="Birthday"
          userId={userId}
          user={user}
          setIsEditing={setIsEditing}
          setUser={setUser}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">
            Birthday:{user.birthday} {formatBirthday(user.birthday)}
          </Typography>
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
}

export default DateOfBirth;
