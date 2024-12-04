import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import { useState } from "react";

function PasswordInput({
  label,
  value,
  setValue,
  autoComplete
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  autoComplete: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={autoComplete}>{label}*</InputLabel>
      <OutlinedInput
        id={autoComplete}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        autoComplete={autoComplete}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "display the password"
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
}

export default PasswordInput;
