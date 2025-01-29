import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const AUTOCOMPLETE_ENDPOINT = `https://places.googleapis.com/v1/places:autocomplete?key=${API_KEY}`;

const LocationPicker = ({
  setLocationUrl,
  setLocationName
}: {
  setLocationUrl: Dispatch<SetStateAction<string | null>>;
  setLocationName: (locationName: string) => void;
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

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
          input: query
        })
      });

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
    }
  };

  const handleSelect = async (suggestion: any) => {
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
      getOptionLabel={(option) =>
        option.placePrediction.structuredFormat.mainText.text
      }
      onInputChange={(_, value) => fetchAutocomplete(value)}
      onChange={(_, newValue) => newValue && handleSelect(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Location" variant="outlined" fullWidth />
      )}
    />
  );
};

export default LocationPicker;
