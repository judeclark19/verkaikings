"use client";

import fundraiserState from "@/lib/FundraiserState";
import { observer } from "mobx-react-lite";
import FundraiserSkeleton from "../FundraiserSkeleton";
import appState from "@/lib/AppState";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import UserListItem from "@/app/people/UserListItem";
import userList from "@/lib/UserList";
import { formatFullBirthday } from "@/lib/clientUtils";
import FundraiserProgressBar from "../FundraiserProgressBar";
import Creator from "../views/Creator/Creator";
import Donor from "../views/Donor/Donor";
import GoBack from "@/components/GoBack";

const Fundraiser = observer(() => {
  const params = useParams();
  const { id } = params;
  const fundraiser = fundraiserState.activeFundraisers.find(
    (fundraiser) => fundraiser.data.id === id
  );

  const creator = userList.users.find(
    (user) => user.id === fundraiser!.data.creatorId
  );

  const [viewAs, setViewAs] = useState("creator");

  if (!appState.isInitialized || !fundraiser) {
    return <FundraiserSkeleton />;
  }

  document.title = `${fundraiser.data.title} | Willemijn's World Website`;

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
      <GoBack />
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          mb: 2
        }}
      >
        {fundraiser.data.title}
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
        Amount raised: €{fundraiser.currentAmount} (of goal €
        {fundraiser.data.goalAmount})
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: "1.5rem"
        }}
      >
        Final day to donate:{" "}
        {formatFullBirthday(fundraiser.data.finalDay, appState.language)}{" "}
      </Typography>

      <FundraiserProgressBar width={90} progress={fundraiser.progress} />
      <Box>
        {viewAs === "creator" && <Creator fundraiser={fundraiser} />}
        {viewAs === "donor" && <Donor fundraiser={fundraiser} />}
      </Box>
    </>
  );
});

export default Fundraiser;
