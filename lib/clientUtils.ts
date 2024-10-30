import { DocumentData } from "firebase-admin/firestore";

export function formatBirthday(input: string) {
  // Parse the input string into a Date object
  const date = new Date(`${input}T00:00:00`);

  // Format the date using toLocaleDateString
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    .replace(/,/g, ", ");
}

export const fetchCityName = async (
  user: DocumentData,
  setCityName: (cityName: string) => void
) => {
  if (user && user.cityId) {
    try {
      const response = await fetch(
        `/api/getPlaceDetails?placeId=${user.cityId}`
      );
      const data = await response.json();

      if (data.result && data.result.formatted_address) {
        setCityName(data.result.formatted_address);
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
    }
  }
};
