import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Alert, Skeleton, Typography } from "@mui/material";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";

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
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Map of Verkaikings
      </Typography>
      <div
        style={{
          position: "relative"
        }}
      >
        <div
          id="map"
          ref={mapRef}
          style={{
            width: "100%",
            height: "600px"
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>

        {appState.isInitialized && userList.filteredUsers.length === 0 && (
          <Alert
            severity="info"
            sx={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}
          >
            No users to show based on the query &ldquo;{userList.query}&rdquo;.
          </Alert>
        )}
      </div>
    </>
  );
});

export default UserMap;
