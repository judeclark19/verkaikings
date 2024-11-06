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
      fontSize: "3rem", // Customize h1 size
      fontWeight: 700 // Adjust weight if necessary
    },
    h2: {
      fontSize: "2.5rem", // You can adjust h2, h3, etc., if needed
      fontWeight: 500
    },
    h3: {
      fontSize: "2rem"
    }
  }
});

export default darkTheme;
