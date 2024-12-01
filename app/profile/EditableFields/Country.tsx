import { Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import CountryPicker from "./CountryPicker";
import EditBtn from "./EditBtn";
import { Public as PublicIcon } from "@mui/icons-material";

const Country = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!myProfileState.countryAbbr) {
    return <Skeleton />;
  }
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
          width: "100%",
          height: "100%"
        }}
      >
        <PublicIcon />

        {isEditing ? (
          <CountryPicker setIsEditing={setIsEditing} />
        ) : (
          <Typography
            component="p"
            sx={{
              color: myProfileState.countryName ? "inherit" : "text.secondary"
            }}
          >
            {myProfileState.countryName || "(Choose your country)"}
          </Typography>
        )}
      </div>

      {!isEditing && <EditBtn setIsEditing={setIsEditing} />}
    </div>
  );
});

export default Country;
