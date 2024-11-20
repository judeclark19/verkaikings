"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import peopleState, { PeopleViews } from "./People.state";
import { DocumentData } from "firebase/firestore";
import { Button, Box, Typography } from "@mui/material";
import ByName from "./ByName";
import ByLocation from "./ByLocation/ByLocation";
import ByBirthday from "./ByBirthday/ByBirthday";
import { useRouter, useSearchParams } from "next/navigation";
import UserMap from "./UserMap/UserMap.UI";

const PeopleList = observer(({ users }: { users: DocumentData[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let viewByParam = searchParams.get("viewBy")?.toLowerCase();
    if (
      // check if viewByParam is one of enum Views
      !Object.values(PeopleViews).includes(viewByParam as PeopleViews)
    ) {
      viewByParam = PeopleViews.NAME;
    }
    peopleState.init(users, viewByParam as PeopleViews);
  }, [users]);

  useEffect(() => {
    router.replace(`?viewBy=${peopleState.viewingBy.toLowerCase()}`);
  }, [peopleState.viewingBy, router]);

  const handleViewChange = (view: PeopleViews) => {
    peopleState.setViewingBy(view);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1rem"
        }}
      >
        <Typography variant="h3" gutterBottom>
          View people by:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem"
          }}
        >
          {Object.values(PeopleViews).map((view) => (
            <Button
              key={view}
              variant={
                peopleState.viewingBy === view ? "contained" : "outlined"
              }
              onClick={() => handleViewChange(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} {/* Capitalize */}
            </Button>
          ))}
        </Box>
      </Box>

      {peopleState.viewingBy === "name" && <ByName />}
      {peopleState.viewingBy === "location" && <ByLocation />}
      {peopleState.viewingBy === "birthday" && <ByBirthday />}
      {peopleState.viewingBy === "map" && <UserMap />}
    </div>
  );
});

export default PeopleList;
