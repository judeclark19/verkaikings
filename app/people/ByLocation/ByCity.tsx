import { List, Paper, Skeleton, Typography } from "@mui/material";
import UserListItem from "../UserListItem";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import Link from "next/link";

const ByCity = observer(
  ({
    countryAbbr,
    cityId,
    titleColor
  }: {
    countryAbbr: string;
    cityId: string;
    titleColor: "primary.dark" | "secondary.dark";
  }) => {
    const noCityListed = cityId === "No city listed";

    return (
      <Paper
        elevation={8}
        color="secondary"
        sx={{
          height: "fit-content"
        }}
      >
        {appState.isInitialized ? (
          <div
            key={cityId}
            style={{
              padding: "1rem"
            }}
          >
            <Typography
              variant="h3"
              component={noCityListed ? "h3" : Link}
              href={
                noCityListed
                  ? ""
                  : `/people?viewBy=map&query=${appState.cityNames[cityId]}`
              }
              sx={{
                textAlign: "center",
                marginTop: 0,
                color: titleColor,
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              {noCityListed ? (
                "No city listed"
              ) : appState.cityNames[cityId] ? (
                appState.cityNames[cityId]
              ) : (
                <Skeleton />
              )}
            </Typography>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                margin: "auto",
                bgcolor: "background.paper",
                padding: 0
              }}
            >
              {userList.usersByCountry[countryAbbr].cities[cityId].map(
                (user) => {
                  return <UserListItem key={user.username} user={user} />;
                }
              )}
            </List>
          </div>
        ) : (
          <Skeleton
            variant="rectangular"
            width="360px"
            height="70vh"
            sx={{ borderRadius: 1 }}
          />
        )}
      </Paper>
    );
  }
);

export default ByCity;
