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
  FormHelperText,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import ByName from "./ByName/ByName";
import ByLocation from "./ByLocation/ByLocation";
import ByBirthday from "./ByBirthday/ByBirthday";
import { useRouter, useSearchParams } from "next/navigation";
import UserMap from "./UserMap/UserMap.UI";
import ByStory from "./ByStory";
import SearchIcon from "@mui/icons-material/Search";
import userList from "@/lib/UserList";
import { ClearIcon } from "@mui/x-date-pickers/icons";

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
  const [searchPlaceholderText, setSearchPlaceholderText] =
    useState("Search users...");
  const [viewingBy, setViewingBy] = useState<PeopleViews>(PeopleViews.NAME);

  useEffect(() => {
    let viewByParam = searchParams.get("viewBy")?.toLowerCase();
    if (!Object.values(PeopleViews).includes(viewByParam as PeopleViews)) {
      viewByParam = PeopleViews.NAME;
    }
    setViewingBy(viewByParam as PeopleViews);
    setLoading(false);
  }, []);

  useEffect(() => {
    router.replace(`?viewBy=${viewingBy.toLowerCase()}`);
    if (viewingBy === "story") {
      setSearchPlaceholderText("Search users or stories...");
    } else {
      setSearchPlaceholderText("Search users...");
    }
    userList.filterUsersByQuery(userList.query, viewingBy);
  }, [viewingBy]);

  const handleViewChange = (view: PeopleViews) => {
    setViewingBy(view);
    userList.filterUsersByQuery(userList.query, view);
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
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          sx={{
            display: {
              xs: "none",
              md: "flex"
            }
          }}
        >
          {Object.values(PeopleViews).map((view) => (
            <Button
              key={view}
              onClick={() => handleViewChange(view)}
              sx={{
                backgroundColor:
                  viewingBy === view ? "primary.main" : "primary.dark",
                fontWeight: viewingBy === view ? "700" : "400"
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </ButtonGroup>

        <FormControl
          fullWidth
          sx={{
            maxWidth: 424,
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

        <TextField
          variant="outlined"
          fullWidth
          placeholder={searchPlaceholderText}
          value={userList.query}
          onChange={(e) => {
            userList.setQuery(e.target.value);
            userList.filterUsersByQuery(e.target.value, viewingBy);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: userList.query && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => {
                      userList.setQuery("");
                      userList.filterUsersByQuery("", viewingBy);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          sx={{
            backgroundColor: "rgba(71, 71, 71)",
            mt: 3,
            maxWidth: 424
          }}
        />
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
