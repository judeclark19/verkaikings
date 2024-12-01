"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar, Box, Divider, Paper, Typography } from "@mui/material";
import { checkIfBirthdayToday, formatFullBirthday } from "@/lib/clientUtils";
import MyProfile from "../MyProfile";
import appState from "@/lib/AppState";
import ProfileSkeleton from "@/app/profile/ProfileSkeleton";
import ReadOnlyContactItem from "../ReadOnlyContactItem";
import {
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  Instagram as InstagramIcon,
  Cake as CakeIcon,
  Public as PublicIcon
} from "@mui/icons-material";
import BeRealIcon from "../../../public/images/icons8-bereal-24.svg";
import DuolingoIcon from "../../../public/images/icons8-duolingo-24.svg";
import { FaWhatsapp, FaTransgender, FaCity } from "react-icons/fa";
import { getEmojiFlag } from "countries-list";

const UserProfile = ({
  decodedToken
}: {
  decodedToken: { email: string; user_id: string };
}) => {
  const params = useParams();
  const { username } = params;
  const [isSelf, setIsSelf] = useState(false);
  const [user, setUser] = useState<DocumentData | null>(null); // State to hold user data
  const [error, setError] = useState(""); // Error state

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Firestore query to find user by username
        const q = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming usernames are unique, grab the first matching user
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
          if (userData.email === decodedToken.email) {
            setIsSelf(true);
          }
          document.title = `${userData.username}'s Profile | Willemijn's World Website`; // Set the document title
        } else {
          setError(`User with username ${username} not found.`);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching user data.");
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    if (!user) {
      document.title = `Loading Profile...`;
    }
  }, [user]);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          justifyContent: "center",
          gap: 3
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
              borderRadius: 2
            }}
          >
            {!user.profilePicture &&
              `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
          </Avatar>
          <br />
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
          <Paper
            elevation={3}
            sx={{
              padding: 3
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center", marginTop: 0 }}>
              Socials
            </Typography>
            <ReadOnlyContactItem value={user.email} icon={<EmailIcon />} />

            {user.instagram && (
              <ReadOnlyContactItem
                value={user.instagram}
                icon={<InstagramIcon />}
              />
            )}

            {user.duolingo && (
              <ReadOnlyContactItem
                value={user.duolingo}
                icon={
                  <DuolingoIcon
                    size={24}
                    style={{
                      flexShrink: 0
                    }}
                  />
                }
              />
            )}

            {user.beReal && (
              <ReadOnlyContactItem
                value={user.beReal}
                icon={
                  <BeRealIcon
                    size={24}
                    style={{
                      flexShrink: 0
                    }}
                  />
                }
              />
            )}
          </Paper>
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
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
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

          <Divider />
          {/* SECOND SECTION - MY WILLEMIJN STORY */}
          <Typography variant="h2">My Willemijn Story</Typography>
          <Paper>
            <Typography
              sx={{
                minHeight: "125px",
                padding: "15px 13px"
              }}
            >
              {user.myWillemijnStory}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
