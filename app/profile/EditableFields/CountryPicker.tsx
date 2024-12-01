import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  SelectChangeEvent
} from "@mui/material";
import { countries } from "countries-list";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SaveBtn from "./SaveBtn";
import appState from "@/lib/AppState";

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
        myProfileState.setCountryName(event.target.value.toLowerCase());
      }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const changedCountry =
        myProfileState.countryAbbr !== myProfileState.user!.countryAbbr;

      if (!changedCountry) {
        setIsEditing(false);
        return;
      }

      const userDoc = doc(db, "users", myProfileState.userId!);
      setLoading(true);

      async function fetchUsers() {
        const users = await getDocs(collection(db, "users"));
        return users.docs.map((doc) => doc.data());
      }

      updateDoc(userDoc, {
        countryAbbr: myProfileState.countryAbbr,
        countryName: myProfileState.countryName,
        cityId: null
      })
        .then(() => {
          fetchUsers().then((users) => {
            appState.setUsers(users);
          });

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
    };

    return (
      <form
        style={{
          width: "100%",
          height: "87px"
        }}
        onSubmit={handleSubmit}
      >
        <FormControl fullWidth variant="outlined" margin="normal">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}
          >
            <InputLabel id="country-picker-select-label">Country</InputLabel>
            <Select
              labelId="country-picker-select-label"
              id="country-picker-select"
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

            <SaveBtn loading={loading} />
          </Box>
        </FormControl>
      </form>
    );
  }
);

export default CountryPicker;
