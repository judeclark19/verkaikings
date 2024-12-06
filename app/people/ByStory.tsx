import {
  Alert,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography
} from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import UserListItem from "./UserListItem";
import userList from "@/lib/UserList";
import { DocumentData } from "firebase/firestore";

const Column = ({ users }: { users: DocumentData[] }) => {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      {users.map((user) => (
        <Card
          sx={{
            width: 600,
            maxWidth: "100%"
          }}
          key={user.username}
        >
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
  );
};

const ByStory = observer(() => {
  const users = userList.filteredUsers
    .filter((user) => user.myWillemijnStory)
    .sort(() => Math.random() - 0.5);

  // split into 2 columns
  const half = Math.ceil(users.length / 2);
  const column1 = users.slice(0, half);
  const column2 = users.slice(half);

  if (!appState.isInitialized) {
    <Skeleton variant="rectangular" width="600px" height="100vh" />;
  }

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Willemijn Stories
      </Typography>

      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          mb: 6
        }}
      >
        How we became her fans
      </Typography>

      {users.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center"
          }}
        >
          <Column users={column1} />

          <Column users={column2} />
        </Box>
      ) : (
        <Alert
          sx={{
            mt: 2
          }}
          severity="info"
        >
          No users or stories found with the search query: &ldquo;
          {userList.query}&rdquo;.
        </Alert>
      )}
    </>
  );
});

export default ByStory;
