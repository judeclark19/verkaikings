self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("/api/firebaseConfig")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Firebase config");
        }
        return response.json();
      })
      .then((config) => {
        importScripts(
          "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
          "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
        );

        firebase.initializeApp(config);

        const messaging = firebase.messaging();

        messaging.onBackgroundMessage((payload) => {
          console.log("[Service Worker] Background message received:", payload);

          const notificationTitle =
            payload.notification?.title || "Default Title";
          const notificationOptions = {
            body: payload.notification?.body || "Default Body",
            icon: "/android-chrome-512x512.png"
          };

          self.registration.showNotification(
            notificationTitle,
            notificationOptions
          );
        });
      })
      .catch((err) => console.error("Failed to fetch Firebase config", err))
  );
});
