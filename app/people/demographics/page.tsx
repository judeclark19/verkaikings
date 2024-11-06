import { Metadata } from "next";
import { Typography } from "@mui/material";
import { fetchUsers } from "@/lib/serverUtils";
import { DocumentData } from "firebase/firestore";
import { fetchCityName } from "@/lib/clientUtils";
import CountryUsers from "./CountryUsers";

export const metadata: Metadata = {
  title: "Demographics | Verkaikings"
};

async function DemographicsPage() {
  const users = await fetchUsers();

  const usersByCountry: { [key: string]: DocumentData[] } = {};
  users.forEach((user) => {
    if (!usersByCountry[user.countryAbbr]) {
      usersByCountry[user.countryAbbr] = [];
    }
    usersByCountry[user.countryAbbr].push(user);
  });

  return (
    <>
      <Typography variant="h1">Demographics</Typography>
      {usersByCountry &&
        Object.keys(usersByCountry).map((countryAbbr) => {
          const countryUsers = usersByCountry[countryAbbr];
          return (
            <CountryUsers
              key={countryAbbr}
              countryAbbr={countryAbbr}
              countryUsers={countryUsers}
            />
          );
        })}
    </>
  );
}

export default DemographicsPage;
