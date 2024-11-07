import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1b5e20" // Elphaba green
    },
    secondary: {
      main: "#1565c0" // Elsa blue
    },
    text: {
      primary: "#ffffff" // White text color
    },
    background: {
      default: "#141514" // Dark background color
    }
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      margin: "2rem 0"
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 500,
      margin: "1.5rem 0"
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      margin: "1rem 0"
    },
    h4: {
      fontSize: "1rem",
      margin: "1rem 0"
    }
  }
});

export default darkTheme;
