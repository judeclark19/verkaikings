import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Alert, Button, Skeleton, Typography } from "@mui/material";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import { PeopleViews } from "../PeopleList";
import { deleteQueryParam } from "@/lib/clientUtils";

const UserMap = observer(() => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !appState.userMap || !appState.isInitialized) return;

    async function initialize() {
      if (!mapRef.current) return;
      await appState.userMap.initializeMap(mapRef.current);
    }

    initialize();
  }, [appState.userMap, appState.isInitialized]);

  const hasQuery = !!userList.query;
  const hasVisibleMarkers =
    appState.userMap && appState.userMap.visibleMarkerCount > 0;

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

      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          mb: 6
        }}
      >
        Showing users who have added a city to their profile
      </Typography>

      {hasQuery && (
        <Alert
          severity={hasVisibleMarkers ? "info" : "error"}
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center"
          }}
        >
          {hasVisibleMarkers
            ? `Showing results for `
            : `No users to show based on `}
          the query &ldquo;{userList.query}&rdquo;.
          <Button
            onClick={() => {
              userList.setQuery("");
              userList.filterUsersByQuery("", PeopleViews.MAP, true);
              deleteQueryParam();
            }}
            sx={{
              ml: 2
            }}
            variant="contained"
            color="primary"
          >
            Clear search
          </Button>
        </Alert>
      )}

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
      </div>
    </>
  );
});

export default UserMap;
