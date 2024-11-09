"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import peopleState from "./People.state";
import { DocumentData } from "firebase/firestore";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ByName from "./ByName";
import ByLocation from "./ByLocation/ByLocation";
import ByBirthday from "./ByBirthday/ByBirthday";

const PeopleList = observer(({ users }: { users: DocumentData[] }) => {
  useEffect(() => {
    peopleState.init(users);
  }, [users]);

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="people-list-select-label">View people by:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="people-list-select"
          value={peopleState.viewingBy}
          label="View people by:"
          onChange={(e) => peopleState.setViewingBy(e.target.value)}
        >
          <MenuItem value="Name">Name (Alphabetical)</MenuItem>
          <MenuItem value="Location">Location (Country and City)</MenuItem>
          <MenuItem value="Birthday">Birthday</MenuItem>
        </Select>
      </FormControl>

      {peopleState.viewingBy === "Name" && <ByName />}
      {peopleState.viewingBy === "Location" && <ByLocation />}
      {peopleState.viewingBy === "Birthday" && <ByBirthday />}
    </div>
  );
});

export default PeopleList;
