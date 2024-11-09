"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import peopleState from "./People.state";
import { DocumentData } from "firebase/firestore";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ByName from "./ByName";
import ByLocation from "./ByLocation/ByLocation";
import ByBirthday from "./ByBirthday/ByBirthday";
import { useRouter, useSearchParams } from "next/navigation";

const PeopleList = observer(({ users }: { users: DocumentData[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let viewByParam = searchParams.get("viewBy")?.toLowerCase();
    if (
      viewByParam !== "name" &&
      viewByParam !== "location" &&
      viewByParam !== "birthday"
    ) {
      viewByParam = "name";
    }
    peopleState.init(users, viewByParam);
  }, [users]);

  useEffect(() => {
    router.replace(`?viewBy=${peopleState.viewingBy.toLowerCase()}`);
  }, [peopleState.viewingBy, router]);

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="people-list-select-label">View people by:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="people-list-select"
          value={peopleState.viewingBy}
          label="View people by:"
          onChange={(e) =>
            peopleState.setViewingBy(e.target.value.toLowerCase())
          }
        >
          <MenuItem value="name">Name (Alphabetical)</MenuItem>
          <MenuItem value="location">Location (Country and City)</MenuItem>
          <MenuItem value="birthday">Birthday</MenuItem>
        </Select>
      </FormControl>

      {peopleState.viewingBy === "name" && <ByName />}
      {peopleState.viewingBy === "location" && <ByLocation />}
      {peopleState.viewingBy === "birthday" && <ByBirthday />}
      {/* TODO: view all willemijn stories, view all socials? view by age or add age to birthday list? */}
    </div>
  );
});

export default PeopleList;
