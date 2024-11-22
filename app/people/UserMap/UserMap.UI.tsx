import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Skeleton, Typography } from "@mui/material";
import placeDataCache from "@/lib/PlaceDataCache";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const UserMap = observer(() => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("UserMap mounted");
    console.log(mapRef.current);
    if (!mapRef.current) return; // Ensure mapRef is ready

    async function initialize() {
      if (!placeDataCache.isInitialized) {
        const users = await getDocs(collection(db, "users"));
        placeDataCache.init(users.docs.map((doc) => doc.data()));
      }

      if (window.google) {
        // Initialize the map
        placeDataCache.userMap?.initializeMap(mapRef.current as HTMLElement);
      } else {
        // Attach an event listener to wait for the Google Maps library to load
        const onGoogleLoad = () =>
          placeDataCache.userMap?.initializeMap(mapRef.current as HTMLElement);

        window.addEventListener("load", onGoogleLoad);
        return () => window.removeEventListener("load", onGoogleLoad);
      }
    }

    initialize();
  }, []);

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
