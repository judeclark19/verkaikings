import { createGlobalStyle } from "styled-components";
//  :root {
//   --navy: #050034;
//   --space-cadet: #25204E;
//   --violet: #444067;
//   --pharaoh: #636081;
//   --periwinkle: #82809A;
//   --gray: #C1C0CD;
//  }

//   body {
//     background-color: var(--navy);
//     color: white;
//     font-family: sans-serif;
//     padding: 0;
//     margin: 0;
//     min-height: 100vh;
//     display: flex;
//     flex-direction: column;
//     position: relative;
//   }

//   body::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background-image: url(${ccLogo.src});
//     background-repeat: repeat;
//     background-size: 100px 100px;
//     opacity: 0.09;
//     z-index: -1;
//   }

//   main {
//     flex: 1;
//   }

//   a {
//     color: #eee;
//     text-decoration: none;

//     &:hover {
//       text-decoration: underline;
//       font-weight: 600;
//     }
//   }

//    button {
//         color: white;
//         font-size: 1rem;
//         padding: 0.5rem 1rem;
//         border: none;
//         border-radius: 0.25rem;
//         cursor: pointer;
//         transition: background-color 0.2s;
//         width: 100%;

//         &:hover {
//             filter: brightness(1.1);
//         }
//    }

//    footer {
//     padding: 30px 20px;
//     background-color: #333;
//     margin-top: 2rem;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;

//     @media (max-width: 720px) {
//       font-size: 14px;
//       padding: 20px;

//       > div {
//         text-align: center;
//       }
//     }

//     a {
//       color: inherit;
//     }

//     .top {
//       display: flex;
//       gap: 40px;
//       justify-content: center;

//       hr {
//         display: none;
//       }

//       @media (max-width: 720px) {
//         flex-direction: column;
//         align-items: center;
//         gap: 14px;

//         hr {
//           display: block;
//           width: 100px;
//         }

//         .vertical-line {
//           display: none;
//         }
//       }
//     }

//     .bottom {
//       font-size: 12px;
//       text-align: center;
//     }
//   }
// `;

const GlobalStyles = createGlobalStyle`

  body {
    background-color: #141514;
    color: white;
    font-family: sans-serif;
  }
`;

export default GlobalStyles;
