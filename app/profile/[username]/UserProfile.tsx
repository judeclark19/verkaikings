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
import { Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import ProfileSkeleton from "../ProfileSkeleton";
import {
  checkIfBirthdayToday,
  fetchCityName,
  formatBirthday,
  getCountryNameByLocale
} from "@/lib/clientUtils";
import MyProfile from "../MyProfile";
import Link from "next/link";

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
  const [cityName, setCityName] = useState<string | null>(null);

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

    async function fetchData() {
      const fetchedCityAndState = await fetchCityName(user!.cityId);
      setCityName(fetchedCityAndState);
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <ProfileSkeleton />;
  }

  if (isSelf) {
    return <MyProfile userId={decodedToken.user_id} />;
  }

  return (
    <div>
      <Typography variant="h1">User Profile: {user.username}</Typography>
      <Typography component="p">First Name: {user.firstName}</Typography>
      <Typography component="p">Last Name: {user.lastName}</Typography>
      <Typography component="p">Email: {user.email}</Typography>
      <Typography component="p">WhatsApp phone: {user.phoneNumber}</Typography>
      <Typography component="p">
        Country: {getCountryNameByLocale(user.countryAbbr)}
      </Typography>
      {cityName && <Typography component="p">City: {cityName}</Typography>}

      {user.birthday && (
        <Typography component="p">
          Birthday: {user.birthday} {formatBirthday(user.birthday)}{" "}
          {checkIfBirthdayToday(user.birthday) && "🎂"}
        </Typography>
      )}

      {user.instagram && (
        <>
          <Link
            href={`https://www.instagram.com/${user.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              display: "flex",
              gap: "0.5rem"
            }}
          >
            <InstagramIcon /> {user.instagram}
          </Link>
        </>
      )}

      {user.myWillemijnStory && (
        <>
          <Typography variant="h2">My Willemijn Story</Typography>
          <Typography component="p">{user.myWillemijnStory}</Typography>
        </>
      )}
    </div>
  );
};

export default UserProfile;
