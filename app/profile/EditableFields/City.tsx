import { useState } from "react";
import CityPicker from "./CityPicker";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import EditBtn from "./EditBtn";
import { FaCity } from "react-icons/fa";

const City = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "space-between",
        height: "76px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexGrow: 1
        }}
      >
        <FaCity
          size={24}
          style={{
            flexShrink: 0
          }}
        />

        {isEditing ? (
          <CityPicker setIsEditing={setIsEditing} />
        ) : (
          <Typography
            component="p"
            sx={{
              color: myProfileState.cityName ? "inherit" : "text.secondary"
            }}
          >
            {myProfileState.cityName || "(Enter your city)"}
          </Typography>
        )}
      </div>

      {!isEditing && <EditBtn setIsEditing={setIsEditing} />}
    </div>
  );
});

export default City;
