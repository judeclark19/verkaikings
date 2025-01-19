"use client";

import fundraiserState from "@/lib/FundraiserState";
import { observer } from "mobx-react-lite";
import FundraiserSkeleton from "../FundraiserSkeleton";
import appState from "@/lib/AppState";
import { useParams } from "next/navigation";
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
  const fundraiser = [
    ...fundraiserState.activeFundraisers,
    ...fundraiserState.pastFundraisers
  ].find((fundraiser) => fundraiser.data.id === id);

  const creator = userList.users.find(
    (user) => user.id === fundraiser!.data.creatorId
  );

  const isCreator = creator?.id === appState.loggedInUser?.id;

  if (!appState.isInitialized || !fundraiser) {
    return <FundraiserSkeleton />;
  }

  document.title = `${fundraiser.data.title} | Willemijn's World Website`;

  return (
    <>
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
        {fundraiser.data.isActive
          ? `Final day to donate: `
          : `Fundraiser ended on `}
        {formatFullBirthday(fundraiser.data.finalDay, appState.language)}{" "}
      </Typography>

      <FundraiserProgressBar width={90} progress={fundraiser.progress} />
      <Box>
        {isCreator && fundraiser.data.isActive && (
          <Creator fundraiser={fundraiser} />
        )}
        {(!fundraiser.data.isActive || !isCreator) && (
          <Donor fundraiser={fundraiser} />
        )}
      </Box>
    </>
  );
});

export default Fundraiser;
