import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import peopleState from "../People.state";
import { Skeleton, Typography } from "@mui/material";

const UserMap = observer(() => {
  useEffect(() => {
    if (!peopleState.userMap) return;

    if (window.google) {
      peopleState.userMap.initializeMap();
    } else {
      window.addEventListener("load", peopleState.userMap.initializeMap);
      return () => {
        if (peopleState.userMap) {
          window.removeEventListener("load", peopleState.userMap.initializeMap);
        }
      };
    }
  }, [peopleState.userMap]);

  return (
    <>
      <Typography variant="h1">Map of Verkaikings</Typography>

      {peopleState.userMap ? (
        <div id="map" style={{ width: "100%", height: "600px" }} />
      ) : (
        <div style={{ width: "100%", height: "600px" }}>
          <Skeleton />
        </div>
      )}
    </>
  );
});

export default UserMap;
