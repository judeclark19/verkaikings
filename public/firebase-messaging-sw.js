self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("/api/getSecret")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shared secret");
        }
        return response.json();
      })
      .then((data) => {
        const sharedSecret = data.sharedSecret;

        // Use the fetched secret in subsequent requests
        return fetch("/api/firebaseConfig", {
          headers: {
            "x-app-secret": sharedSecret
          }
        });
      })
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
