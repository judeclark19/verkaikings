import { Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import CountryPicker from "./CountryPicker";
import { getCountryNameByLocale } from "@/lib/clientUtils";
import EditBtn from "./EditBtn";

const Country = observer(() => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!myProfileState.countryAbbr) {
    return <Skeleton />;
  }
  return (
    <>
      {isEditing ? (
        <CountryPicker setIsEditing={setIsEditing} />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <Typography component="p">
            Country: {getCountryNameByLocale(myProfileState.countryAbbr)}
          </Typography>
          <EditBtn setIsEditing={setIsEditing} />
        </div>
      )}
    </>
  );
});

export default Country;
