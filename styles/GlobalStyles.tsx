import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  :root {
    --med-pink: #E59AA8;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: white;
    font-family: sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'DM Serif Display', serif;
  }

  .highlighted {
  animation: highlight-flash 2s;
}

@keyframes highlight-flash {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: #ffb74d;
  }
}

  // styling the Google Maps InfoWindow
  .gm-style-iw-chr {
   position: absolute;
   right: -8px;
   top: -8px;
  }

  .info-window {
    color: black;
    max-width: 200px;

    ul {
      padding-left: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    button {
      cursor: pointer;
    }
   
  }
`;

export default GlobalStyles;
