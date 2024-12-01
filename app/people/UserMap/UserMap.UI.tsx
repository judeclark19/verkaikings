import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Skeleton, Typography } from "@mui/material";
import appState from "@/lib/AppState";

const UserMap = observer(() => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !appState.userMap) return;

    async function initialize() {
      if (window.google) {
        // Initialize the map
        appState.userMap?.initializeMap(mapRef.current as HTMLElement);
      } else {
        // Attach an event listener to wait for the Google Maps library to load
        const onGoogleLoad = () =>
          appState.userMap?.initializeMap(mapRef.current as HTMLElement);

        window.addEventListener("load", onGoogleLoad);
        return () => window.removeEventListener("load", onGoogleLoad);
      }
    }

    initialize();
  }, [appState.userMap]);

  return (
    <>
      <Typography variant="h1">Map of Verkaikings</Typography>

      <div id="map" ref={mapRef} style={{ width: "100%", height: "600px" }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
    </>
  );
});

export default UserMap;
