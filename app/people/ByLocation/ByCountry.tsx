import userList from "@/lib/UserList";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from "@mui/material";
import { observer } from "mobx-react-lite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ByCity from "./ByCity";

const ByCountry = observer(({ countryAbbr }: { countryAbbr: string }) => {
  const cityIds = Object.keys(userList.usersByCountry[countryAbbr].cities);
  const sortedCityIds = cityIds.filter((id) => id !== "No city listed");
  const noCityListedId = cityIds.includes("No city listed")
    ? ["No city listed"]
    : [];
  const orderedCityIds = [...sortedCityIds, ...noCityListedId];

  const countryName = userList.usersByCountry[countryAbbr].countryName;

  return (
    <Box
      key={countryAbbr}
      sx={{
        width: "100%",
        maxWidth: 500,
        height: "fit-content"
      }}
    >
      <Accordion
        sx={{
          bgcolor: "rgb(46, 46, 46)"
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${countryAbbr}-content`}
          id={`panel-${countryAbbr}-header`}
        >
          <Typography
            variant="h2"
            sx={{
              my: "8px",
              fontSize: "1.8rem"
            }}
          >
            {countryName} ({sortedCityIds.length}{" "}
            {sortedCityIds.length === 1 ? "city" : "cities"})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            {orderedCityIds.map((cityId) => (
              <ByCity key={cityId} countryAbbr={countryAbbr} cityId={cityId} />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

export default ByCountry;
