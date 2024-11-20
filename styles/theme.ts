import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F8E3E7", // light pink,
      dark: "#D25169" // dark pink
    },
    secondary: {
      main: "#F0F2E7", // light green
      dark: "#A3AE6A" // dark green
    },
    text: {
      primary: "#ffffff", // White text color
      secondary: "#232323" // Dark text
    },
    background: {
      default: "#232323" // Dark background color
    }
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontFamily: "DM Serif Display, serif",
      fontSize: "3.5rem",
      fontWeight: 700,
      margin: "2rem 0",
      "@media (max-width:600px)": {
        fontSize: "2rem" // Adjusted size for mobile
      }
    },
    h2: {
      fontFamily: "DM Serif Display, serif",
      fontSize: "2.5rem",
      fontWeight: 500,
      margin: "1.5rem 0",
      "@media (max-width:600px)": {
        fontSize: "1.8rem" // Adjusted size for mobile
      }
    },
    h3: {
      fontFamily: "DM Serif Display, serif",
      fontSize: "1.5rem",
      fontWeight: 500,
      margin: "1rem 0"
    },
    h4: {
      fontFamily: "DM Serif Display, serif",
      fontSize: "1rem",
      margin: "1rem 0"
    },
    h5: {
      fontFamily: "DM Serif Display, serif",
      fontSize: "0.875rem",
      margin: "1rem 0"
    },
    h6: {
      fontFamily: "DM Serif Display, serif",
      fontSize: "0.75rem",
      margin: "1rem 0"
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.7)" // Adjust label color
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.7)" // Adjust placeholder color
          }
        }
      }
    }
  }
});

export default darkTheme;
