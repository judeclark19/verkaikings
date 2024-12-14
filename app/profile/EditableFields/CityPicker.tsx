"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
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
import userList from "@/lib/UserList";

const CityPicker = observer(
  ({ setIsEditing }: { setIsEditing: (state: boolean) => void }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState<string | null>(
      myProfileState.countryAbbr
    );

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
              appState.formatCityAndStatefromAddress(place.address_components)
            );
            myProfileState.setPlaceId(place.place_id);
            const countryComponent = place.address_components.find(
              (component) => component.types.includes("country")
            );
            const countryCodeFromAddressComponents = countryComponent
              ? countryComponent.short_name
              : "";
            setCountry(countryCodeFromAddressComponents);
          }
        });
      }
    }, []);

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();

      const changedCity =
        myProfileState.placeId !== myProfileState.user!.cityId;

      const userDoc = doc(db, "users", myProfileState.userId!);

      // case 1: user clears the city
      if (inputRef.current!.value === "") {
        setLoading(true);
        updateDoc(userDoc, {
          cityId: null
        })
          .then(() => {
            console.log("User's city removed.", myProfileState.cityName);
          })
          .catch((error) => {
            console.error("Error updating user's city: ", error);
          })
          .finally(() => {
            setLoading(false);
            setIsEditing(false);
          });

        return;
      }

      // case 2: user does not change the city
      if (!changedCity) {
        setIsEditing(false);
        return;
      }

      // case 3: user changes the city
      setLoading(true);

      // check if city is in cache
      if (!appState.cityNames[myProfileState.placeId!]) {
        await appState.fetchCityDetails(myProfileState.placeId!);
      }

      // check if country is in cache
      if (country && !appState.countryNames[country]) {
        appState.addCountryToList(country);
      }

      async function fetchUsers() {
        const users = await getDocs(collection(db, "users"));
        return users.docs.map((doc) => doc.data());
      }

      updateDoc(userDoc, {
        cityId: myProfileState.placeId,
        countryAbbr: country?.toLowerCase() || null
      })
        .then(async () => {
          // Fetch the updated document
          const updatedDoc = await getDoc(userDoc);
          const updatedUserData = updatedDoc.data();

          if (updatedUserData) {
            // Update the user list with the fetched users
            fetchUsers().then((users) => {
              userList.setUsers(users);
            });

            // Update MyProfile state with new document data
            myProfileState.setUser(updatedUserData);

            // Check if the country was changed, and update country details in MyProfile state
            if (country && country !== myProfileState.countryAbbr) {
              myProfileState.setCountryAbbr(country.toLowerCase());
              myProfileState.setCountryName(country);
            }

            console.log(
              "User's city updated successfully",
              updatedUserData.cityName
            );
          } else {
            console.error("No data found in the updated document.");
          }
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
          gap: "1rem",
          justifyContent: "space-between",
          width: "100%"
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
          slotProps={{
            inputLabel: {
              shrink: true
            }
          }}
        />
        <SaveBtn loading={loading} />
      </form>
    );
  }
);

export default CityPicker;
