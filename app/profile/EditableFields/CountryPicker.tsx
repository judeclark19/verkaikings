import React, { useState } from "react";
import { FormControl, Box, Autocomplete, TextField } from "@mui/material";
import { countries } from "countries-list";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SaveBtn from "./SaveBtn";
import userList, { UserDocType } from "@/lib/UserList";
import appState from "@/lib/AppState";
import FlagComponent from "@/components/Flag";

const CountryPicker = observer(
  ({ setIsEditing }: { setIsEditing: (state: boolean) => void }) => {
    const locale = appState.language || "en"; // Detect user's locale
    const [loading, setLoading] = useState(false);

    // Initialize DisplayNames with locale and region options
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });

    // Generate array of country codes
    const countryArray = Object.keys(countries);

    const handleChange = (newValue: string | null) => {
      if (newValue) {
        myProfileState.setCountryAbbr(newValue.toLowerCase());
      }
      const changedCountry =
        newValue?.toLowerCase() !== myProfileState.user!.countryAbbr;

      if (changedCountry) {
        myProfileState.setCountryName(newValue?.toLowerCase() || "");
      }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const changedCountry =
        myProfileState.countryAbbr !== myProfileState.user!.countryAbbr;

      if (!changedCountry || !myProfileState.countryAbbr) {
        setIsEditing(false);
        return;
      }

      const userDoc = doc(db, "users", myProfileState.userId!);
      setLoading(true);

      if (
        myProfileState.countryAbbr &&
        !appState.countryNames[myProfileState.countryAbbr]
      ) {
        appState.addCountryToList(myProfileState.countryAbbr);
      }

      async function fetchUsers() {
        const users = await getDocs(collection(db, "users"));
        return users.docs.map((doc) => doc.data());
      }

      updateDoc(userDoc, {
        countryAbbr: myProfileState.countryAbbr,
        cityId: null
      })
        .then(() => {
          try {
            myProfileState.setCityName(null);
            myProfileState.setPlaceId(null);
            fetchUsers().then((users) => {
              userList.setUsers(users as UserDocType[]);
            });

            console.log("Country updated");
            myProfileState.setCountryName(
              myProfileState.countryAbbr
                ? appState.countryNames[myProfileState.countryAbbr]
                : ""
            );
            appState.setSnackbarMessage("Country updated successfully.");
          } catch (error) {
            if (error instanceof RangeError) {
              console.error(
                "RangeError: invalid argument =>",
                myProfileState.countryAbbr,
                error
              );
              return; // do not rethrow so it doesn't trigger the Firestore catch
            }
            throw error; // rethrow anything else
          }
        })
        .catch((error) => {
          appState.setSnackbarMessage("Error updating country.");
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
            <Autocomplete
              id="country-select"
              sx={{
                flexGrow: 1
              }}
              options={countryArray}
              autoHighlight
              value={myProfileState.countryAbbr?.toUpperCase() || null} // Ensure value is a valid option
              getOptionLabel={(option) => displayNames.of(option) || option} // Show country name, fallback to code
              onChange={(_, newValue) => {
                handleChange(newValue);
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    <FlagComponent countryCode={option} />
                    {appState.formatCountryNameFromISOCode(option) || option}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a country"
                  fullWidth
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                      autoComplete: "new-password" // disable autocomplete and autofill
                    }
                  }}
                />
              )}
            />

            <SaveBtn loading={loading} />
          </Box>
        </FormControl>
      </form>
    );
  }
);

export default CountryPicker;
