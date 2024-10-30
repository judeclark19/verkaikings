"use client";

import { useEffect, useRef, useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  fetchCityName,
  fetchCountryInfo,
  getCityAndState
} from "@/lib/clientUtils";

export default function CityPicker({
  cityId,
  setCityId,
  setIsEditing,
  user,
  userId,
  setUser
}: {
  cityId: string | null;
  setCityId: (cityId: string | null) => void;
  setIsEditing: (state: boolean) => void;
  user: DocumentData;
  userId: string;
  setUser: (user: DocumentData) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCityName(user, setCityName);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(cities)"]
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address && place.place_id) {
          console.log("place", place);
          setCityName(getCityAndState(place.address_components));
          setCityId(place.place_id);
        }
      });
    }
  }, [cityId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userDoc = doc(db, "users", userId);
    setLoading(true);

    const { countryAbbr, countryName } = await fetchCountryInfo(cityId!);

    updateDoc(userDoc, {
      cityId: cityId || null,
      cityName: cityName || null,
      countryAbbr: countryAbbr || null,
      countryName: countryName || null
    })
      .then(() => {
        setUser({
          ...user,
          cityId: cityId || null,
          cityName: cityName || null,
          countryAbbr: countryAbbr || null
        });
        console.log("User's city updated successfully");
        setLoading(false);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating user's city: ", error);
        setLoading(false);
        setIsEditing(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}
    >
      <TextField
        label="Enter your city"
        variant="outlined"
        fullWidth
        inputRef={inputRef}
        value={cityName}
        onChange={(e) => {
          console.log("onChange setCityName:", e.target.value);
          setCityName(e.target.value);
        }}
        sx={{ margin: "10px 0", width: "300px", maxWidth: "100%" }}
      />
      <Button type="submit" variant="contained">
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
}
