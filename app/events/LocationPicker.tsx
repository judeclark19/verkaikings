import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const AUTOCOMPLETE_ENDPOINT = `https://places.googleapis.com/v1/places:autocomplete?key=${API_KEY}`;

type Suggestion = {
  placePrediction: {
    placeId: string;
    structuredFormat: {
      mainText: { text: string };
    };
    text: { text: string };
  };
};

const LocationPicker = ({
  setLocationUrl,
  setLocationName
}: {
  setLocationUrl: Dispatch<SetStateAction<string | null>>;
  setLocationName: (locationName: string) => void;
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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
          includedPrimaryTypes: ["establishment"] // Only fetch establishments
        })
      });

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
    }
  };

  const handleSelect = async (suggestion: Suggestion) => {
    const placeId = suggestion.placePrediction.placeId;
    setLocationName(suggestion.placePrediction.structuredFormat.mainText.text);

    // Fetch Place Details
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?key=${API_KEY}&fields=googleMapsUri`
      );
      const data = await response.json();
      setLocationUrl(data.googleMapsUri || null);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      getOptionLabel={(option) => {
        if (typeof option === "string") return "";
        return option.placePrediction.text.text;
      }}
      onInputChange={(_, value) => {
        setLocationName(value);
        fetchAutocomplete(value);
      }}
      onChange={(_, newValue) => {
        if (newValue && typeof newValue !== "string") {
          handleSelect(newValue);
        }
        if (typeof newValue === "string") {
          setLocationUrl(null);
          setLocationName(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Location" variant="outlined" fullWidth />
      )}
    />
  );
};

export default LocationPicker;
