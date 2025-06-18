importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCQ7VLSHNBNaF4z12Iyp8MTLRhnSii0f90",
  authDomain: "verkaikings.firebaseapp.com",
  projectId: "verkaikings",
  messagingSenderId: "686749873158",
  appId: "1:686749873158:web:f0bd1413027172e3807f87"
});

const messaging = firebase.messaging();
