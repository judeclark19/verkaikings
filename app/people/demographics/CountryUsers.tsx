import { Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";

function CountryUsers({
  countryAbbr,
  countryUsers
}: {
  countryAbbr: string;
  countryUsers: DocumentData[];
}) {
  return (
    <div>
      <Typography variant="h2">{countryAbbr}</Typography>
      {countryUsers.map((user) => (
        <div key={user.id}>
          <Typography variant="h3">{user.username}</Typography>
          <Typography>{user.cityId}</Typography>
        </div>
      ))}
    </div>
  );
}

// Next TODO: convert countryAbbr to countryName and cityId to cityName

export default CountryUsers;
