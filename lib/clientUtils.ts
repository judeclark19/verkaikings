import { DocumentData } from "firebase-admin/firestore";

export function formatBirthday(input: string) {
  // Parse the input string into a Date object
  const date = new Date(`${input}T00:00:00`);

  // Detect the user's locale or default to "nl"
  const userLocale = navigator.language || "nl";

  // Format the date using toLocaleDateString with the detected locale
  return date
    .toLocaleDateString(userLocale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    .replace(/,/g, ", ");
}

export const fetchCityName = async (user: DocumentData) => {
  if (user && user.cityId) {
    try {
      const response = await fetch(
        `/api/getPlaceDetails?placeId=${user.cityId}`
      );
      const data = await response.json();

      if (data.result && data.result.address_components) {
        return getCityAndState(data.result.address_components);
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
    }
  }

  return "";
};

export const fetchCountryInfo = async (placeId: string) => {
  try {
    const response = await fetch(`/api/getPlaceDetails?placeId=${placeId}`);
    const data = await response.json();

    if (data.result && data.result.address_components) {
      const countryComponent = data.result.address_components.find(
        (component: any) => component.types.includes("country")
      );

      if (countryComponent) {
        // Extract the `iso2` code and the country name (already localized)
        const countryInfo = {
          countryAbbr: countryComponent.short_name.toLowerCase(),
          countryName: countryComponent.long_name
        };

        return countryInfo;
      }
    }
  } catch (error) {
    console.error("Failed to fetch country details:", error);
  }

  return { countryAbbr: null, countryName: null };
};

export function getCityAndState(addressComponents: any[]) {
  let city = "";
  let state = "";

  addressComponents.forEach((component) => {
    if (component.types.includes("locality")) {
      city = component.long_name; // Usually the city name
    } else if (component.types.includes("sublocality") && !city) {
      city = component.long_name; // Backup for smaller city-level areas
    } else if (component.types.includes("administrative_area_level_1")) {
      state = component.short_name; // Typically the state code (e.g., "TN" for Tennessee)
    }
  });

  // If city is still not set, try administrative_area_level_2
  if (!city) {
    addressComponents.forEach((component) => {
      if (component.types.includes("administrative_area_level_2")) {
        city = component.long_name;
      }
    });
  }

  // Avoid repeating city and state if they're the same
  if (city === state) {
    state = "";
  }

  // Return "City, State" if both are available, otherwise just return the city
  return state ? `${city}, ${state}` : city;
}
