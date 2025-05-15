"use client";

import { FormEvent, useRef, useState } from "react";
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

type Suggestion = {
  placePrediction: {
    placeId: string;
    text: { text: string };
  };
};

const CityPicker = observer(
  ({ setIsEditing }: { setIsEditing: (state: boolean) => void }) => {
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState<string | null>(
      myProfileState.countryAbbr
    );
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const initialValue = useRef(
      myProfileState.cityName ? `${myProfileState.cityName}` : null
    ).current;

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
    const handleSelect = async (suggestion: Suggestion) => {
      const placeId = suggestion.placePrediction.placeId;

      if (!appState.cityDetails[placeId]) {
        await appState.fetchCityDetails(placeId);
      }

      const newDisplayName = appState.formatCityAndStatefromAddress(
        appState.cityDetails[placeId]?.address_components
      );

      myProfileState.setCityName(newDisplayName);
      myProfileState.setPlaceId(placeId);
      setCountry(
        appState.cityDetails[placeId]?.address_components
          ?.find(
            (c: {
              long_name: string;
              short_name: string;
              types: string[];
              languageCode: string;
            }) => c.types.includes("country")
          )
          ?.short_name.toLowerCase() || ""
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
        console.log("City not changed");
        setIsEditing(false);
        myProfileState.setCityName(initialValue);
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
          onChange={(_, newValue) =>
            newValue && typeof newValue !== "string" && handleSelect(newValue)
          }
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
