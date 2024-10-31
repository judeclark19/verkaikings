"use client";

import { useEffect, useRef, useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { observer } from "mobx-react-lite";
import {
  fetchCityName,
  fetchCountryInfo,
  getCityAndState
} from "@/lib/clientUtils";

import myProfileState from "./MyProfile.state";

const CityPicker = observer(
  ({
    cityId,
    setCityId,
    setIsEditing,
    user,
    userId,
    setUser,
    setPlaceId
  }: {
    cityId: string | null;
    setCityId: (cityId: string | null) => void;
    setIsEditing: (state: boolean) => void;
    user: DocumentData;
    userId: string;
    setUser: (user: DocumentData) => void;
    setPlaceId: (placeId: string | null) => void;
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        if (myProfileState.user) {
          const fetchedCityName = await fetchCityName(myProfileState.user);
          myProfileState.setCityName(fetchedCityName);
        }
      };
      if (user) {
        fetchData();
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
            myProfileState.setCityName(
              getCityAndState(place.address_components)
            );
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
        cityName: myProfileState.cityName,
        countryAbbr: countryAbbr || null,
        countryName: countryName || null
      })
        .then(() => {
          setUser({
            ...user,
            cityId: cityId || null,
            cityName: myProfileState.cityName,
            countryAbbr: countryAbbr || null
          });

          console.log(
            "User's city updated successfully",
            myProfileState.cityName
          );
          setPlaceId(cityId);
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
          value={myProfileState.cityName}
          onChange={(e) => {
            myProfileState.setCityName(e.target.value);
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
);

export default CityPicker;
