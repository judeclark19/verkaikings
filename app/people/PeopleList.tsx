"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import peopleState, { PeopleViews } from "./People.state";
import {
  Button,
  Box,
  Typography,
  ButtonGroup,
  CircularProgress
} from "@mui/material";
import ByName from "./ByName";
import ByLocation from "./ByLocation/ByLocation";
import ByBirthday from "./ByBirthday/ByBirthday";
import { useRouter, useSearchParams } from "next/navigation";
import UserMap from "./UserMap/UserMap.UI";
import placeDataCache from "@/lib/PlaceDataCache";

const PeopleList = observer(() => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialize = async () => {
      if (!placeDataCache.isInitialized) {
        await placeDataCache.waitForInitialization(); // Wait for PlaceDataCache to initialize
      }
      setLoading(false); // Set loading to false after initialization
    };

    initialize();
  }, []);

  useEffect(() => {
    let viewByParam = searchParams.get("viewBy")?.toLowerCase();
    if (!Object.values(PeopleViews).includes(viewByParam as PeopleViews)) {
      viewByParam = PeopleViews.NAME;
    }
    peopleState.init(viewByParam as PeopleViews);
  }, []);

  useEffect(() => {
    router.replace(`?viewBy=${peopleState.viewingBy.toLowerCase()}`);
  }, [peopleState.viewingBy, router]);

  const handleViewChange = (view: PeopleViews) => {
    peopleState.setViewingBy(view);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: "2rem" }}>
          View people by:
        </Typography>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          {Object.values(PeopleViews).map((view) => (
            <Button
              key={view}
              onClick={() => handleViewChange(view)}
              sx={{
                backgroundColor:
                  peopleState.viewingBy === view
                    ? "primary.dark"
                    : "primary.main"
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {peopleState.viewingBy === "name" && <ByName />}
      {peopleState.viewingBy === "location" && <ByLocation />}
      {peopleState.viewingBy === "birthday" && <ByBirthday />}
      {peopleState.viewingBy === "map" && <UserMap />}
    </div>
  );
});

export default PeopleList;
