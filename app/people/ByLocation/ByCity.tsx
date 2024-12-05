import { List, Paper, Skeleton, Typography } from "@mui/material";
import UserListItem from "../UserListItem";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";

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
              sx={{
                textAlign: "center",
                marginTop: 0,
                color: titleColor
              }}
            >
              {cityId === "No city listed" ? (
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
