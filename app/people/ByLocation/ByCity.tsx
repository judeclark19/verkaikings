import { List, Skeleton, Typography } from "@mui/material";
import UserListItem from "../UserListItem";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";

const ByCity = observer(
  ({ countryAbbr, cityId }: { countryAbbr: string; cityId: string }) => {
    return (
      <>
        {appState.isInitialized ? (
          <div
            key={cityId}
            style={{
              marginLeft: "2rem"
            }}
          >
            <Typography variant="h3">
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
                bgcolor: "background.paper"
              }}
            >
              {appState.usersByCountry[countryAbbr].cities[cityId].map(
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
      </>
    );
  }
);

export default ByCity;
