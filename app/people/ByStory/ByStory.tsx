import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography
} from "@mui/material";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";
import UserListItem from "../UserListItem";
import userList from "@/lib/UserList";
import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { PeopleViews } from "../PeopleList";
import StoryComments from "./StoryComments";
import StoryReactions from "./StoryReactions";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

const Column = observer(({ users }: { users: DocumentData[] }) => {
  const [stories, setStories] = useState<Record<string, DocumentData>>({});

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    users.forEach((user) => {
      const storyDocRef = doc(db, "myWillemijnStories", user.id);

      const unsubscribe = onSnapshot(storyDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setStories((prevStories) => ({
            ...prevStories,
            [user.id]: docSnapshot.data()
          }));
        }
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [users]);

  return (
    <Box
      sx={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      {users.map((user) => {
        const story = stories[user.id];

        const storyDoc = appState.myWillemijnStories.filteredStories.find(
          (story) => story.authorId === user.id
        );

        return (
          <Card
            sx={{
              width: 600,
              maxWidth: "100%",
              mb: 3
            }}
            key={user.username}
          >
            <CardContent>
              {/* Story Author and Content */}
              <UserListItem user={user} />
              <Typography
                sx={{
                  marginTop: 1
                }}
              >
                {story?.storyContent || "Loading..."}
              </Typography>

              {story && <StoryReactions story={storyDoc!} />}
              {story && <StoryComments story={storyDoc!} />}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
});

const ByStory = observer(() => {
  const stories = appState.myWillemijnStories.filteredStories;

  const users = userList.users
    .slice()
    .sort(() => Math.random() - 0.5)
    .filter((user) => {
      return stories.some((story) => story.authorId === user.id);
    });

  // split into 2 columns
  const half = Math.ceil(users.length / 2);
  const column1 = users.slice(0, half);
  const column2 = users.slice(half);

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

      {!appState.isInitialized && (
        <Skeleton variant="rectangular" width="100%" height="100vh" />
      )}

      {userList.query && (
        <Alert
          sx={{
            my: 2,
            display: "flex",
            alignItems: "center"
          }}
          severity={users.length === 0 ? "error" : "info"}
        >
          {users.length === 0
            ? `No users or stories found with `
            : `Showing results for `}
          the search query: &ldquo;
          {userList.query}&rdquo;.
          <Button
            onClick={() => {
              userList.setQuery("");
              userList.filterUsersByQuery("", PeopleViews.STORY);
            }}
            sx={{
              ml: 2
            }}
            variant="contained"
            color="primary"
          >
            Clear search
          </Button>
        </Alert>
      )}

      {users.length > 0 && (
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
      )}
    </>
  );
});

export default ByStory;
