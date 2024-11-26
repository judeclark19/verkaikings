"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  ButtonGroup,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";
import ByName from "./ByName";
import ByLocation from "./ByLocation/ByLocation";
import ByBirthday from "./ByBirthday/ByBirthday";
import { useRouter, useSearchParams } from "next/navigation";
import UserMap from "./UserMap/UserMap.UI";
import ByStory from "./ByStory";

export enum PeopleViews {
  NAME = "name",
  BIRTHDAY = "birthday",
  LOCATION = "location",
  MAP = "map",
  STORY = "story"
}

const PeopleList = observer(() => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewingBy, setViewingBy] = useState<PeopleViews>(PeopleViews.NAME);

  useEffect(() => {
    let viewByParam = searchParams.get("viewBy")?.toLowerCase();
    if (!Object.values(PeopleViews).includes(viewByParam as PeopleViews)) {
      viewByParam = PeopleViews.NAME;
    }
    setViewingBy(viewByParam as PeopleViews);
    setLoading(false); // Set loading to false after initialization
  }, []);

  useEffect(() => {
    router.replace(`?viewBy=${viewingBy.toLowerCase()}`);
  }, [viewingBy]);

  const handleViewChange = (view: PeopleViews) => {
    setViewingBy(view);
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
              onClick={() => setViewingBy(view)}
              sx={{
                backgroundColor:
                  viewingBy === view ? "primary.dark" : "primary.main"
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </ButtonGroup>

        <FormControl
          fullWidth
          sx={{
            maxWidth: 300,
            marginBottom: 2,
            display: {
              xs: "flex",
              md: "none"
            }
          }}
        >
          <Select
            labelId="view-by-select-label"
            value={viewingBy}
            onChange={(event) =>
              handleViewChange(event.target.value as PeopleViews)
            }
          >
            {Object.values(PeopleViews).map((view) => (
              <MenuItem key={view} value={view}>
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select view</FormHelperText>
        </FormControl>
      </Box>

      {viewingBy === "name" && <ByName />}
      {viewingBy === "location" && <ByLocation />}
      {viewingBy === "birthday" && <ByBirthday />}
      {viewingBy === "map" && <UserMap />}
      {viewingBy === "story" && <ByStory />}
    </div>
  );
});

export default PeopleList;
