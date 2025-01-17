"use client";

import appState from "@/lib/AppState";
import fundraiserState from "@/lib/FundraiserState";
import userList from "@/lib/UserList";
import { Skeleton, Typography, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Creator from "./views/Creator/Creator";
import Donor from "./views/Donor/Donor";
import { formatFullBirthday } from "@/lib/clientUtils";
import FundraiserProgressBar from "./FundraiserProgressBar";
import UserListItem from "../people/UserListItem";

const Fundraiser = observer(() => {
  const { activeFundraiser } = fundraiserState;
  const creator = userList.users.find(
    (user) => user.id === activeFundraiser?.creatorId
  );

  const [viewAs, setViewAs] = useState("creator");

  if (!appState.isInitialized) {
    return (
      <>
        <Skeleton
          variant="text"
          sx={{
            fontSize: "5rem",
            textAlign: "center",
            margin: "auto",
            mb: 2,
            width: "50%"
          }}
        />
        <Skeleton
          variant="rectangular"
          height={500}
          sx={{ marginBottom: "32px" }}
        />
      </>
    );
  }

  if (!activeFundraiser) {
    return (
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        "No active fundraiser"
      </Typography>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <button
          onClick={() => setViewAs("creator")}
          style={{
            backgroundColor: viewAs === "creator" ? "blue" : "white"
          }}
        >
          Creator
        </button>
        <button
          onClick={() => setViewAs("donor")}
          style={{
            backgroundColor: viewAs === "donor" ? "blue" : "white"
          }}
        >
          donor
        </button>
      </div>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          mb: 2
        }}
      >
        {activeFundraiser.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          width: "fit-content",
          alignItems: "center",
          margin: "auto"
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            display: "flex"
          }}
        >
          Created&nbsp;by
        </Typography>
        <UserListItem user={creator!} />
      </Box>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          color: "primary.dark",
          fontSize: "2rem"
        }}
      >
        Amount raised: €{fundraiserState.currentAmount} (of goal €
        {fundraiserState.goalAmount})
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: "1.5rem"
        }}
      >
        Final day to donate: {formatFullBirthday(activeFundraiser.finalDay)}{" "}
      </Typography>

      <FundraiserProgressBar width={90} />
      <Box>
        {viewAs === "creator" && <Creator />}
        {viewAs === "donor" && <Donor />}
      </Box>
    </>
  );
});

export default Fundraiser;
