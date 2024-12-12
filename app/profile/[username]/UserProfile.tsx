"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentData } from "firebase/firestore";
import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import { checkIfBirthdayToday, formatFullBirthday } from "@/lib/clientUtils";
import MyProfile from "../MyProfile";
import appState from "@/lib/AppState";
import { ProfileSkeleton, ReadOnlyContactItem } from "../components";
import {
  AccountCircle as AccountCircleIcon,
  Cake as CakeIcon,
  Public as PublicIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { FaWhatsapp, FaTransgender, FaCity } from "react-icons/fa";
import { getEmojiFlag } from "countries-list";
import SocialsList from "./SocialsList";
import { observer } from "mobx-react-lite";
import StoryComments from "@/app/people/ByStory/StoryComments";
import StoryReactions from "@/app/people/ByStory/StoryReactions";

const UserProfile = observer(
  ({ decodedToken }: { decodedToken: { email: string; user_id: string } }) => {
    const params = useParams();
    const { username } = params;
    const [isSelf, setIsSelf] = useState(false);
    const [user, setUser] = useState<DocumentData | null>(null); // State to hold user data
    const [error, setError] = useState(""); // Error state
    const [usersWillemijnStory, setUsersWillemijnStory] =
      useState<DocumentData | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (!appState.isInitialized) return;

      // Set document title based on user state
      if (user) {
        document.title = `${user.username}'s Profile | Willemijn's World Website`;
      } else if (appState.userList.users.length && !user) {
        const userInfo = appState.userList.users.find(
          (u) => u.username === username
        );

        if (userInfo) {
          setUser(userInfo);

          // Check if the current user is viewing their own profile
          if (userInfo.email === decodedToken.email) {
            setIsSelf(true);
          }

          // Find and set the user's Willemijn story if it exists
          const userStory = appState.myWillemijnStories.allStories.find(
            (story) => story.authorId === userInfo.id
          );
          if (userStory) {
            setUsersWillemijnStory(userStory);
          }

          document.title = `${userInfo.username}'s Profile | Willemijn's World Website`;
        } else {
          setError(`User with username ${username} not found.`);
          document.title = "Profile Not Found | Willemijn's World Website";
        }
      } else {
        document.title = "Loading Profile...";
      }
    }, [
      appState.isInitialized,
      user,
      username,
      appState.userList.users,
      decodedToken.email
    ]);

    if (error) {
      return <div>{error}</div>;
    }
    if (!user) {
      return <ProfileSkeleton />;
    }

    if (isSelf) {
      return <MyProfile />;
    }

    return (
      <>
        {/* back button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row"
            },
            justifyContent: "center",
            gap: {
              xs: 0,
              md: 3
            }
          }}
        >
          {/* SIDEBAR */}
          <Box
            sx={{
              maxWidth: "100%",
              flexShrink: 0,
              width: {
                xs: "100%",
                md: "300px"
              },
              mt: 4
            }}
          >
            <Avatar
              src={user.profilePicture || ""}
              alt={`${user.firstName} ${user.lastName}`}
              variant="square"
              sx={{
                width: 200,
                height: 200,
                fontSize: 40,
                bgcolor: "secondary.main",
                margin: "auto",
                borderRadius: 2,
                mb: 4
              }}
            >
              {!user.profilePicture &&
                `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
            </Avatar>
            <Typography
              variant="h1"
              display={{
                xs: "block",
                md: "none"
              }}
              sx={{
                textAlign: "center"
              }}
            >
              {user.firstName} {user.lastName} {""}
              {checkIfBirthdayToday(user.birthday) && "🎂"}
            </Typography>

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block"
                }
              }}
            >
              {(user.instagram || user.duolingo || user.beReal) && (
                <SocialsList user={user} />
              )}
            </Box>
          </Box>
          {/* MAIN CONTENT */}
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: {
                xs: "100%",
                md: "800px"
              }
            }}
          >
            {/* FIRST SECTION - CONTACT DETAILS */}
            <Typography
              variant="h1"
              display={{
                xs: "none",
                md: "block"
              }}
            >
              {user.firstName} {user.lastName}{" "}
              {checkIfBirthdayToday(user.birthday) && "🎂"}
            </Typography>
            <Paper elevation={6} sx={{ px: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  columnGap: 6,
                  rowGap: 0
                }}
                gridTemplateColumns={{
                  xs: "repeat(auto-fit, 100%)",
                  sm: "repeat(auto-fit, 300px)"
                }}
                justifyContent={{
                  xs: "center",
                  md: "start"
                }}
              >
                <ReadOnlyContactItem
                  value={user.username}
                  icon={<AccountCircleIcon />}
                />
                <ReadOnlyContactItem
                  value={user.phoneNumber}
                  icon={<FaWhatsapp size={24} />}
                  link={`https://wa.me/${user.phoneNumber}`}
                />
                {user.birthday && (
                  <ReadOnlyContactItem
                    value={formatFullBirthday(user.birthday)}
                    icon={<CakeIcon />}
                  />
                )}
                {user.pronouns && (
                  <ReadOnlyContactItem
                    value={user.pronouns}
                    icon={
                      <FaTransgender
                        size={24}
                        style={{
                          flexShrink: 0
                        }}
                      />
                    }
                  />
                )}

                {user.cityId && (
                  <ReadOnlyContactItem
                    value={appState.cityNames[user.cityId]}
                    icon={
                      <FaCity
                        size={24}
                        style={{
                          flexShrink: 0
                        }}
                      />
                    }
                  />
                )}

                <ReadOnlyContactItem
                  value={appState.countryNames[user.countryAbbr]}
                  icon={
                    appState.countryNames[user.countryAbbr] ? (
                      <>{getEmojiFlag(user.countryAbbr.toUpperCase())}</>
                    ) : (
                      <PublicIcon />
                    )
                  }
                />
              </Box>
            </Paper>

            <Box
              sx={{
                display: {
                  xs: "block",
                  md: "none"
                },
                mt: 3
              }}
            >
              {(user.instagram || user.duolingo || user.beReal) && (
                <SocialsList user={user} />
              )}
            </Box>

            {/* SECOND SECTION - MY WILLEMIJN STORY */}
            {usersWillemijnStory && usersWillemijnStory.storyContent && (
              <>
                <Typography variant="h2">My Willemijn Story</Typography>
                <Paper>
                  <Typography
                    sx={{
                      minHeight: "125px",
                      padding: "15px 13px"
                    }}
                  >
                    {usersWillemijnStory.storyContent}
                  </Typography>
                  <Box
                    sx={{
                      p: 1,
                      mt: -3
                    }}
                  >
                    <StoryReactions story={usersWillemijnStory} />
                    <StoryComments story={usersWillemijnStory} />
                  </Box>
                </Paper>
              </>
            )}
          </Box>
        </Box>
      </>
    );
  }
);

export default UserProfile;
