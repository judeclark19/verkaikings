import { Typography } from "@mui/material";

function Country({ countryName }: { countryName: string | null }) {
  return <Typography component="p">Country: {countryName}</Typography>;
}

export default Country;
