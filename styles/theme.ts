import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1b5e20"
    },
    secondary: {
      main: "#1565c0"
    },
    text: {
      primary: "#ffffff" // White text color
    },
    background: {
      default: "#141514" // Dark background color
    }
  }
});

export default darkTheme;
