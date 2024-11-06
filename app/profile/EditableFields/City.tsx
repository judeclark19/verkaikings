import { useState } from "react";
import CityPicker from "./CityPicker";
import { Typography } from "@mui/material";
import EditFieldBtn from "./EditFieldBtn";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";

const City = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <>
      {isEditing ? (
        <CityPicker setIsEditing={setIsEditing} />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">City: {myProfileState.cityName}</Typography>
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default City;
