import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import peopleState from "../People.state";
import { Skeleton } from "@mui/material";

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

  if (!peopleState.userMap) return;
  <div style={{ width: "100%", height: "600px" }}>
    <Skeleton />
  </div>;
  return <div id="map" style={{ width: "100%", height: "600px" }} />;
});

export default UserMap;
