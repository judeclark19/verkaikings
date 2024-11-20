"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { observer } from "mobx-react-lite";
import { fetchCountryInfoByPlaceId, getCityAndState } from "@/lib/clientUtils";
import myProfileState from "../MyProfile.state";

const CityPicker = observer(
  ({ setIsEditing }: { setIsEditing: (state: boolean) => void }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

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
          if (
            place.formatted_address &&
            place.place_id &&
            place.address_components
          ) {
            myProfileState.setCityName(
              getCityAndState(place.address_components)
            );
            myProfileState.setPlaceId(place.place_id);
          }
        });
      }
    }, []);

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      const userDoc = doc(db, "users", myProfileState.userId!);
      setLoading(true);

      const { countryAbbr, countryName } = await fetchCountryInfoByPlaceId(
        myProfileState.placeId
      );

      updateDoc(userDoc, {
        cityId: myProfileState.placeId,
        cityName: myProfileState.cityName,
        countryAbbr: countryAbbr || null,
        countryName: countryName || null
      })
        .then(() => {
          myProfileState.setCountryNameFromPlaceId(myProfileState.placeId);
          myProfileState.setCountryAbbr(countryAbbr);
          console.log(
            "User's city updated successfully",
            myProfileState.cityName
          );
        })
        .catch((error) => {
          console.error("Error updating user's city: ", error);
        })
        .finally(() => {
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
          value={myProfileState.cityName || ""}
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
