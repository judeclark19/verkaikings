import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import UserListItem from "./UserListItem";

const ByStory = observer(() => {
  return (
    <div>
      <Typography variant="h1">Willemijn Stories</Typography>

      {appState.users && appState.isInitialized ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {appState.users
            .filter((user) => user.myWillemijnStory)
            .map((user) => (
              <Card sx={{ width: 600, maxWidth: "100%" }} key={user.username}>
                <CardContent>
                  <UserListItem user={user} />
                  <Typography
                    sx={{
                      marginTop: 1
                    }}
                  >
                    {user.myWillemijnStory}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      ) : (
        <Skeleton variant="rectangular" width="600px" height="70vh" />
      )}
    </div>
  );
});

export default ByStory;
