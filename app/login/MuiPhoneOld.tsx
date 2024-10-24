import "react-international-phone/style.css";
import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput
} from "react-international-phone";

export type PhoneData = {
  phoneNumber: string;
  countryCode: string;
  countryAbbr: string;
  nationalNumber: string;
};

interface MuiPhoneProps {
  value: string;
  onChange: (data: PhoneData) => void;
}

export const MuiPhone: React.FC<MuiPhoneProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const [initialCountry, setInitialCountry] = useState<string>("nl"); // Default to NL
  const [isManualChange, setIsManualChange] = useState<boolean>(false); // Track manual changes

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: initialCountry, // This will work for the first load only
      value,
      countries: defaultCountries,
      onChange: (data) => {}
    });

  useEffect(() => {
    // Get user's locale from the browser
    if (!isManualChange) {
      const userLocale = navigator.language;
      const localeCountryCode = userLocale.split("-")[1]?.toLowerCase();

      // If localeCountryCode is valid, set it; otherwise, default to NL
      if (
        localeCountryCode &&
        defaultCountries.some((c) => c[1] === localeCountryCode)
      ) {
        setInitialCountry(localeCountryCode); // Set the initial country based on locale
        setCountry(localeCountryCode); // Manually update the country in the input
      } else {
        setCountry("nl"); // Fallback to NL if locale isn't valid
      }
    }
  }, [setCountry, isManualChange]);

  const handleCountryChange = (e: any) => {
    setIsManualChange(true); // Mark that the user manually changed the country
    setCountry(e.target.value); // Set the country based on the dropdown selection
  };

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      required
      sx={{ width: "100%", marginTop: "16px", marginBottom: "8px" }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
              style={{ marginRight: "2px", marginLeft: "-8px" }}
            >
              <Select
                MenuProps={{
                  style: {
                    height: "300px",
                    width: "360px",
                    top: "10px",
                    left: "-34px"
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  }
                }}
                sx={{
                  width: "max-content",
                  fieldset: {
                    display: "none"
                  },
                  '&.Mui-focused:has(div[aria-expanded="false"])': {
                    fieldset: {
                      display: "block"
                    }
                  },
                  ".MuiSelect-select": {
                    padding: "8px",
                    paddingRight: "24px !important"
                  },
                  svg: {
                    right: 0
                  }
                }}
                value={country.iso2}
                onChange={handleCountryChange} // Use the handler to mark manual changes
                renderValue={(value) => (
                  <FlagImage iso2={value} style={{ display: "flex" }} />
                )}
              >
                {defaultCountries.map((c) => {
                  const country = parseCountry(c);
                  return (
                    <MenuItem key={country.iso2} value={country.iso2}>
                      <FlagImage
                        iso2={country.iso2}
                        style={{ marginRight: "8px" }}
                      />
                      <Typography marginRight="8px">{country.name}</Typography>
                      <Typography color="gray">+{country.dialCode}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </InputAdornment>
          )
        }
      }}
      {...restProps}
    />
  );
};
