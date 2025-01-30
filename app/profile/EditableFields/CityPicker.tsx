"use client";

import { FormEvent, useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import SaveBtn from "./SaveBtn";
import appState from "@/lib/AppState";
import userList, { UserDocType } from "@/lib/UserList";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const AUTOCOMPLETE_ENDPOINT = `https://places.googleapis.com/v1/places:autocomplete?key=${API_KEY}`;

const CityPicker = observer(
  ({ setIsEditing }: { setIsEditing: (state: boolean) => void }) => {
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState<string | null>(
      myProfileState.countryAbbr
    );
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
      console.log(suggestions);
    }, [suggestions]);

    // Fetch city suggestions
    const fetchAutocomplete = async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(AUTOCOMPLETE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: query,
            includedPrimaryTypes: ["(cities)"] // Only fetch cities
          })
        });

        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Error fetching autocomplete:", error);
      }
    };

    // Handle city selection
    const handleSelect = async (suggestion: any) => {
      const placeId = suggestion.placePrediction.placeId;

      if (!appState.cityDetails[placeId]) {
        await appState.fetchCityDetails(placeId);
      }

      const newDisplayName = appState.formatCityAndStatefromAddress(
        appState.cityDetails[placeId]?.addressComponents
      );
      console.log("newDisplayName", newDisplayName);
      myProfileState.setCityName(newDisplayName);
      myProfileState.setPlaceId(placeId);
      setCountry(
        appState.cityDetails[placeId]?.addressComponents?.find((c: any) =>
          c.types.includes("country")
        )?.shortText || ""
      );
    };

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      const changedCity =
        myProfileState.placeId !== myProfileState.user!.cityId;
      const userDoc = doc(db, "users", myProfileState.userId!);

      // User cleared the city
      if (!myProfileState.cityName) {
        setLoading(true);
        await updateDoc(userDoc, { cityId: null });
        setLoading(false);
        setIsEditing(false);
        return;
      }

      // User did not change the city
      if (!changedCity) {
        setIsEditing(false);
        return;
      }

      // Fetch city and country data if not cached
      if (!appState.cityNames[myProfileState.placeId!]) {
        await appState.fetchCityDetails(myProfileState.placeId!);
      }
      if (country && !appState.countryNames[country]) {
        appState.addCountryToList(country);
      }

      setLoading(true);

      await updateDoc(userDoc, {
        cityId: myProfileState.placeId,
        countryAbbr: country?.toLowerCase() || null
      });

      // Fetch updated user data
      const updatedDoc = await getDoc(userDoc);
      const updatedUserData = updatedDoc.data() as UserDocType;

      if (updatedUserData) {
        const usersSnapshot = await getDocs(collection(db, "users"));
        userList.setUsers(
          usersSnapshot.docs.map((doc) => doc.data()) as UserDocType[]
        );

        myProfileState.setUser(updatedUserData);
        if (country && country !== myProfileState.countryAbbr) {
          myProfileState.setCountryAbbr(country.toLowerCase());
          myProfileState.setCountryName(country);
        }

        appState.setSnackbarMessage(
          `City successfully updated to ${myProfileState.cityName}`
        );
      }

      setLoading(false);
      setIsEditing(false);
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <Autocomplete
          freeSolo
          fullWidth
          options={suggestions}
          //   getOptionLabel={(option) => option.placePrediction.text.text}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : option.placePrediction.text.text || ""
          }
          value={myProfileState.cityName || ""}
          onInputChange={(_, value) => {
            fetchAutocomplete(value);
            myProfileState.setCityName(value);
          }}
          onChange={(_, newValue) => newValue && handleSelect(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter your city"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <SaveBtn loading={loading} />
      </form>
    );
  }
);

export default CityPicker;
