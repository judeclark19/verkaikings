import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getDetails } from "use-places-autocomplete";

const LocationPicker = ({
  location,
  setLocation
}: {
  location: any | null;
  setLocation: (location: any | null) => void;
}) => {
  //   const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");

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
            setValue(place.name || place.formatted_address || "");
          }
        });
      }
    };

    // if (modalOpen) {
    initAutocomplete(); // Initialize immediately when modal opens
    // }

    return () => {
      // Cleanup function
    };
  }, []);

  const handleSelect = async (placeId: string) => {
    try {
      const details = await getDetails({ placeId });
      if (typeof details !== "string" && details.name) {
        setLocation(details);
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
        value={value}
        fullWidth
        onChange={(e) => {
          if (!e.target.value) {
            setLocation(null);
          }
          setValue(e.target.value);
        }}
        label="Location"
        slotProps={{
          inputLabel: {
            shrink: true
          }
        }}
      />
      {/* {location && (
        <div>
          <h3>Selected Theater</h3>
          <p>{location.name}</p>
          <p>{location.formatted_address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location.name
            )}&query_place_id=${location.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      )} */}
    </div>
  );
};

export default LocationPicker;
