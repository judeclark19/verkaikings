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
import userList, { UserDocType } from "@/lib/UserList";
import { doc, onSnapshot } from "firebase/firestore";
import { PeopleViews } from "../PeopleList";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { deleteQueryParam } from "@/lib/clientUtils";
import { StoryDocType } from "@/lib/MyWillemijnStories";
import Reactions from "@/components/Reactions/Reactions";
import CommentAccordion from "@/components/Comments/CommentAccordion";

const Column = observer(({ users }: { users: UserDocType[] }) => {
  const [stories, setStories] = useState<Record<string, StoryDocType>>({});

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    users.forEach((user) => {
      const storyDocRef = doc(db, "myWillemijnStories", user.id);

      const unsubscribe = onSnapshot(storyDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setStories((prevStories) => ({
            ...prevStories,
            [user.id]: docSnapshot.data() as StoryDocType
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
            sx={{ width: 800, maxWidth: "100%", mb: 3 }}
            key={user.username}
          >
            <CardContent>
              <UserListItem user={user} />
              <Typography sx={{ mt: 1, mb: 2 }}>
                {story?.storyContent || (
                  <Skeleton variant="text" width="100%" height={150} />
                )}
              </Typography>

              {story && (
                <Reactions
                  collectionName="myWillemijnStories"
                  target={storyDoc!}
                  documentRef={doc(db, "myWillemijnStories", storyDoc!.id)}
                />
              )}

              {story && (
                <CommentAccordion
                  collectionName="myWillemijnStories"
                  docId={storyDoc!.id}
                  comments={storyDoc!.comments}
                  authorId={storyDoc!.authorId}
                  label="Comments"
                  notifyUrl={`/profile`}
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
});

const ByStory = observer(() => {
  const [shuffledUsers, setShuffledUsers] = useState<UserDocType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appState.isInitialized) {
      setLoading(true);
      return;
    }

    const stories = appState.myWillemijnStories.filteredStories;
    const filteredUsers = userList.users.filter((user) =>
      stories.some((story) => story.authorId === user.id)
    );

    // Shuffle users and set state
    const shuffled = filteredUsers.slice().sort(() => Math.random() - 0.5);
    setShuffledUsers(shuffled);
    setLoading(false);
  }, [appState.isInitialized, userList.users, userList.filteredUsers]);

  // Split into 2 columns
  const half = Math.ceil(shuffledUsers.length / 2);
  const column1 = shuffledUsers.slice(0, half);
  const column2 = shuffledUsers.slice(half);

  return (
    <>
      <Typography variant="h1" sx={{ textAlign: "center" }}>
        Willemijn Stories
      </Typography>

      <Typography variant="h3" sx={{ textAlign: "center", mb: 6 }}>
        How we became her fans
      </Typography>

      {loading ? (
        <Skeleton variant="rectangular" width="100%" height="100vh" />
      ) : (
        <>
          {userList.query && (
            <Alert
              sx={{
                my: 2,
                display: "flex",
                alignItems: "center"
              }}
              severity={shuffledUsers.length === 0 ? "error" : "info"}
            >
              {shuffledUsers.length === 0
                ? `No users or stories found with `
                : `Showing results for `}
              the search query: &ldquo;{userList.query}&rdquo;.
              <Button
                onClick={() => {
                  userList.setQuery("");
                  userList.filterUsersByQuery("", PeopleViews.STORY, true);
                  deleteQueryParam();
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

          {shuffledUsers.length > 0 && (
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
      )}
    </>
  );
});

export default ByStory;
