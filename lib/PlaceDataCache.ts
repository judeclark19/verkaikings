import { CountryUsersType } from "@/app/people/People.state";
import UserMapState from "@/app/people/UserMap/UserMap.state";
import { DocumentData } from "firebase-admin/firestore";
import { makeAutoObservable, toJS } from "mobx";

class PlaceDataCache {
  isInitialized = false;
  users: DocumentData[] = [];
  cityNames: Record<string, string> = {};
  countryNames: Record<string, string> = {};
  usersByCountry: Record<string, CountryUsersType> = {};
  userMap: UserMapState | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  init(users: DocumentData[]) {
    // Prevent reinitialization
    if (this.isInitialized) {
      console.log("placeDataCache already initialized", toJS(this));
      return;
    }
    console.log("initializing...");

    this.users = users;
    // Populate city names
    const cityIds = users.map((user) => user.cityId);
    for (const cityId of cityIds) {
      if (!cityId || this.cityNames[cityId]) continue;

      this.cityNames[cityId] = this.fetchCityName(cityId);
    }

    // Populate country names
    const countryISOs = users.map((user) => user.countryAbbr);
    for (const iso of countryISOs) {
      if (!iso || this.countryNames[iso]) continue;
      this.countryNames[iso] = this.formatCountryNameFromISOCode(iso) as string;
    }

    // Populate usersByCountry
    this.initUsersByCountry();

    this.isInitialized = true;
    console.log("PLACEDATACACHE AFTER INIT:", toJS(this));
  }

  fetchCityName(cityId: string) {
    console.log("$$$$$$");
    return "CityAndState";

    // if (cityId) {
    //   try {
    //     const response = await fetch(`/api/getPlaceDetails?placeId=${cityId}`);
    //     const data = await response.json();

    //     if (data.result && data.result.address_components) {
    //       return formatCityAndStatefromAddress(data.result.address_components);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch place details:", error);
    //   }
    // }

    // return "";
  }

  formatCountryNameFromISOCode(isoCode: string) {
    return "CountryName";
    //  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    //  return displayNames.of(countryCode.toUpperCase());
  }

  initUsersByCountry() {
    // INIT USERS BY COUNTRY
    this.usersByCountry = {};
    this.users.forEach((user) => {
      // let { countryAbbr, cityId } = user;
      const countryAbbr = user.countryAbbr;
      let cityId = user.cityId;

      if (!cityId) cityId = "No city listed";

      if (!this.usersByCountry[countryAbbr]) {
        // init country object
        this.usersByCountry[countryAbbr] = {
          countryName: this.countryNames[countryAbbr] || "",
          cities: {
            [cityId]: [user]
          }
        };
      } else if (
        this.usersByCountry[countryAbbr] &&
        !this.usersByCountry[countryAbbr].cities[cityId]
      ) {
        // init city object
        this.usersByCountry[countryAbbr].cities[cityId] = [user];
      } else if (
        this.usersByCountry[countryAbbr] &&
        this.usersByCountry[countryAbbr].cities[cityId]
      ) {
        // add user to city
        this.usersByCountry[countryAbbr].cities[cityId].push(user);
      }
    });

    this.initUserMap();
  }

  initUserMap() {
    // INIT USER MAP
    this.userMap = new UserMapState(
      this.users,
      this.usersByCountry,
      this.cityNames
    );
  }

  formatCityAndStatefromAddress(
    addressComponents: google.maps.GeocoderAddressComponent[]
  ) {
    let city = "";
    let state = "";

    const countriesWithState = ["US", "CA", "AU", "BR", "AR", "MX", "IN"];
    const countryComponent = addressComponents.find((component) =>
      component.types.includes("country")
    );
    const countryCodeFromAddressComponents = countryComponent
      ? countryComponent.short_name
      : "";

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

    // // Only include "City, State" format if the country requires it
    if (
      state &&
      countriesWithState.includes(countryCodeFromAddressComponents)
    ) {
      return `${city}, ${state}`;
    }

    // Otherwise, return just the city
    return city;
  }

  addCountryToList(isoCode: string) {
    if (!this.countryNames[isoCode]) {
      this.countryNames[isoCode] = this.formatCountryNameFromISOCode(isoCode);
    }
  }
}

const placeDataCache = new PlaceDataCache();
export default placeDataCache;
