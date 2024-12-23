import { TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getDetails } from "use-places-autocomplete";

const LocationPicker = ({
  setLocationUrl,
  locationName,
  setLocationName
}: {
  setLocationUrl: Dispatch<SetStateAction<string | null>>;
  locationName: string;
  setLocationName: (locationName: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["establishment"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.place_id) {
            handleSelect(place.place_id);
            setLocationName(place.name || place.formatted_address || "");
          }
        });
      }
    };

    initAutocomplete();
  }, []);

  const handleSelect = async (placeId: string) => {
    try {
      const details = await getDetails({ placeId });
      if (typeof details !== "string" && details.name && details.url) {
        setLocationName(details.name);
        setLocationUrl(details.url);
        console.log("Selected place details:", details);
      } else {
        console.error("Details fetched are invalid or missing name");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div>
      <TextField
        variant="outlined"
        inputRef={inputRef}
        value={locationName}
        fullWidth
        onChange={(e) => {
          if (!e.target.value) {
            setLocationName("");
            setLocationUrl(null);
          }
          setLocationName(e.target.value);
        }}
        label="Location"
        slotProps={{
          inputLabel: {
            shrink: true
          }
        }}
      />
    </div>
  );
};

export default LocationPicker;
