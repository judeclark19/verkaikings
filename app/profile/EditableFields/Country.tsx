import { Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import EditFieldBtn from "./EditFieldBtn";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import CountryPicker from "./CountryPicker";

const Country = observer(({ userId }: { userId: string }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!myProfileState.countryName) {
    return <Skeleton />;
  }
  return (
    <>
      {isEditing ? (
        <CountryPicker userId={userId} setIsEditing={setIsEditing} />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">
            Country: {myProfileState.countryName}
          </Typography>
          <EditFieldBtn setState={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default Country;
