import { useState } from "react";
import CityPicker from "./CityPicker";
import { Skeleton, Typography } from "@mui/material";
import EditFieldBtn from "./EditFieldBtn";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";

const City = observer(({ userId }: { userId: string }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // if (!myProfileState.cityName) {
  //   return <Skeleton />;
  // }

  return (
    <>
      {isEditing ? (
        <CityPicker setIsEditing={setIsEditing} userId={userId} />
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
