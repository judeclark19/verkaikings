export {}; // Ensures the file is treated as a module

declare global {
  interface Window {
    google: typeof google;
  }
}
