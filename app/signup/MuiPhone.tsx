import "react-international-phone/style.css";
import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  ParsedCountry,
  usePhoneInput
} from "react-international-phone";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";

export type PhoneData = {
  phone: string;
  inputValue: string;
  country: ParsedCountry;
};

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: PhoneData) => void;
  disabled?: boolean;
  disabledCountry?: string;
}

export const MuiPhone: React.FC<MUIPhoneProps> = observer(
  ({ value, onChange, disabled, disabledCountry, ...restProps }) => {
    const {
      inputValue,
      handlePhoneValueChange,
      inputRef,
      country,
      setCountry
    } = usePhoneInput({
      defaultCountry: "nl",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      const userLocale = appState.language;
      const localeCountryCode = userLocale.split("-")[1]?.toLowerCase();

      if (
        localeCountryCode &&
        defaultCountries.some((c) => c[1] === localeCountryCode)
      ) {
        setCountry(localeCountryCode);
      }
    }, []);

    return (
      <TextField
        variant="outlined"
        label="Phone number"
        color="primary"
        placeholder="Phone number"
        value={disabled ? value : inputValue}
        onChange={handlePhoneValueChange}
        type="tel"
        inputRef={inputRef}
        required
        disabled={disabled}
        sx={{
          width: "100%",
          marginTop: "16px",
          marginBottom: "8px",
          cursor: disabled ? "not-allowed" : "text"
        }}
        slotProps={{
          input: {
            readOnly: disabled,
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
                    cursor: disabled ? "not-allowed" : "pointer",
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
                  value={disabled ? disabledCountry : country.iso2}
                  disabled={disabled} // Disable country selection to make it read-only
                  onChange={(event) => {
                    const selectedCountryIso2 = event.target.value;
                    const selectedCountry = defaultCountries.find(
                      (c) => parseCountry(c).iso2 === selectedCountryIso2
                    );
                    if (selectedCountry) {
                      setCountry(selectedCountry[1]); // Update the country
                    }
                  }}
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
                        <Typography marginRight="8px">
                          {country.name}
                        </Typography>
                        <Typography color="gray">
                          +{country.dialCode}
                        </Typography>
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
  }
);
