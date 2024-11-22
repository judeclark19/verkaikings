// export function getCityAndState(
//   addressComponents: google.maps.GeocoderAddressComponent[]
// ) {
//   let city = "";
//   let state = "";

//   const countriesWithState = ["US", "CA", "AU", "BR", "AR", "MX", "IN"];
//   const countryComponent = addressComponents.find((component) =>
//     component.types.includes("country")
//   );
//   const countryCodeFromAddressComponents = countryComponent
//     ? countryComponent.short_name
//     : "";

//   addressComponents.forEach((component) => {
//     if (component.types.includes("locality")) {
//       city = component.long_name; // Usually the city name
//     } else if (component.types.includes("sublocality") && !city) {
//       city = component.long_name; // Backup for smaller city-level areas
//     } else if (component.types.includes("administrative_area_level_1")) {
//       state = component.short_name; // Typically the state code (e.g., "TN" for Tennessee)
//     }
//   });

//   // If city is still not set, try administrative_area_level_2
//   if (!city) {
//     addressComponents.forEach((component) => {
//       if (component.types.includes("administrative_area_level_2")) {
//         city = component.long_name;
//       }
//     });
//   }

//   // Avoid repeating city and state if they're the same
//   if (city === state) {
//     state = "";
//   }

//   // // Only include "City, State" format if the country requires it
//   if (state && countriesWithState.includes(countryCodeFromAddressComponents)) {
//     return `${city}, ${state}`;
//   }

//   // Otherwise, return just the city
//   return city;
// }

export const fetchCountryInfoByPlaceId = async (placeId: string | null) => {
  console.log("fetchCountryInfoByPlaceId $$$$$$$$");
  // if (!placeId) {
  //   return { countryAbbr: null, countryName: null };
  // }

  // try {
  //   const response = await fetch(`/api/getPlaceDetails?placeId=${placeId}`);
  //   const data = await response.json();

  //   if (data.result && data.result.address_components) {
  //     const countryComponent = data.result.address_components.find(
  //       (
  //         component: google.maps.GeocoderAddressComponent | { types: string[] }
  //       ) => component.types.includes("country")
  //     );

  //     if (countryComponent) {
  //       // Extract the `iso2` code and the country name (already localized)
  //       const countryInfo = {
  //         countryAbbr: countryComponent.short_name.toLowerCase(),
  //         countryName: countryComponent.long_name
  //       };

  //       return countryInfo;
  //     }
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch country details:", error);
  // }

  return { countryAbbr: null, countryName: null };
};

export const getFullLocationNameByPlaceId = async (placeId: string) => {
  // try {
  //   const response = await fetch(`/api/getPlaceDetails?placeId=${placeId}`);
  //   const data = await response.json();

  //   if (data.result && data.result.address_components) {
  //     const addressComponents = data.result.address_components;
  //     return {
  //       locationName: `${getCityAndState(
  //         addressComponents
  //       )}, ${getCountryNameByLocale(
  //         addressComponents.find(
  //           (
  //             component:
  //               | google.maps.GeocoderAddressComponent
  //               | { types: string[] }
  //           ) => component.types.includes("country")
  //         ).short_name
  //       )}`,
  //       cityName: getCityAndState(addressComponents)
  //     };
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch place details:", error);
  // }

  return {
    locationName: "",
    cityName: ""
  };
};

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

export function checkIfBirthdayToday(birthday: string) {
  if (!birthday) return false;

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const userBirthdayMonth = birthday.split("-")[1];
  const userBirthdayDay = birthday.split("-")[2];

  const isToday =
    parseInt(userBirthdayMonth) === todayMonth &&
    parseInt(userBirthdayDay) === todayDay;

  return isToday;
}
