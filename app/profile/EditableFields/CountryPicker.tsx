import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Box,
  SelectChangeEvent
} from "@mui/material";
import { countries } from "countries-list";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CountryPicker = observer(
  ({ setIsEditing }: { setIsEditing: (state: boolean) => void }) => {
    const locale = navigator.language || "en"; // Detect user's locale
    const [loading, setLoading] = useState(false);

    // Initialize DisplayNames with locale and region options
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });

    // Generate array of country codes
    const countryArray = Object.keys(countries);

    const handleChange = (event: SelectChangeEvent<string>) => {
      myProfileState.setCountryAbbr(event.target.value.toLowerCase());
      const changedCountry =
        event.target.value.toLowerCase() !== myProfileState.user!.countryAbbr;

      if (changedCountry) {
        myProfileState.setCountryName(
          displayNames.of(event.target.value) || null
        );
      }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const changedCountry =
        myProfileState.countryAbbr !== myProfileState.user!.countryAbbr;

      if (changedCountry) {
        const userDoc = doc(db, "users", myProfileState.userId!);
        setLoading(true);

        updateDoc(userDoc, {
          countryAbbr: myProfileState.countryAbbr,
          countryName: myProfileState.countryName,
          cityId: null
        })
          .then(() => {
            console.log("Country updated");
            myProfileState.setCityName(null);
            myProfileState.setPlaceId(null);
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          })
          .finally(() => {
            setLoading(false);
            setIsEditing(false);
          });
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              maxWidth: "300px"
            }}
          >
            <InputLabel>Country</InputLabel>
            <Select
              value={myProfileState.countryAbbr?.toUpperCase() || ""}
              onChange={handleChange}
              label="Country"
              fullWidth
            >
              {countryArray.map((code) => (
                <MenuItem key={code} value={code}>
                  {displayNames.of(code)} {/* Localized country name */}
                </MenuItem>
              ))}
            </Select>

            <Button type="submit" variant="contained">
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </FormControl>
      </form>
    );
  }
);

export default CountryPicker;
