import UserMapState from "@/app/people/UserMap/UserMap.state";
import myProfileState from "@/app/profile/MyProfile.state";
import { DocumentData } from "firebase-admin/firestore";
import { makeAutoObservable, toJS } from "mobx";
import userList, { UserList } from "./UserList";

export type CountryUsersType = {
  countryName: string;
  cities: Record<string, DocumentData[]>;
};

class AppState {
  isInitialized = false;
  // users: DocumentData[] = [];
  userList: UserList = userList;
  loggedInUser: DocumentData | null = null;
  cityNames: Record<string, string> = {};
  cityDetails: Record<string, google.maps.places.PlaceResult> = {};
  countryNames: Record<string, string> = {};
  // usersByCountry: Record<string, CountryUsersType> = {};
  // usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};
  userMap: UserMapState | null = null;
  initPromise: Promise<void> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async init(users: DocumentData[], userId: string) {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      await this.initPromise; // Wait for any ongoing initialization
      return;
    }

    this.initPromise = (async () => {
      // this.users = users;
      this.userList = userList;
      this.userList.init(users);
      this.loggedInUser = users.find((user) => user.id === userId) || null;
      this.loadFromLocalStorage();

      // Fetch city names and details
      const cityIds = users.map((user) => user.cityId);
      for (const cityId of cityIds) {
        if (!cityId) continue;

        if (!this.cityNames[cityId] || !this.cityDetails[cityId]) {
          await this.fetchCityDetails(cityId);
        }
      }

      // Populate country names
      const countryISOs = users.map((user) => user.countryAbbr);
      for (const iso of countryISOs) {
        if (!iso || this.countryNames[iso]) continue;
        this.countryNames[iso] = this.formatCountryNameFromISOCode(
          iso
        ) as string;
      }

      this.userList.setUsersByCountry(users);
      this.userList.setUsersByBirthday(users);
      this.saveToLocalStorage();
      myProfileState.init(this.loggedInUser!, userId);
      this.setInitialized(true);
    })();

    await this.initPromise;
  }

  setInitialized(value: boolean) {
    this.isInitialized = value;
  }

  async waitForInitialization() {
    if (this.isInitialized) return;
    if (this.initPromise) await this.initPromise;
  }

  loadFromLocalStorage() {
    try {
      const storedCache = localStorage.getItem("placeDataCache");

      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);

        if (!localStorage.getItem("pdcLastUpdated")) {
          localStorage.setItem("pdcLastUpdated", Date.now().toString());
        }

        const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
        if (
          Date.now() - parseInt(localStorage.getItem("pdcLastUpdated")!, 10) <=
          threeMonthsInMs
        ) {
          this.cityNames = parsedCache.cityNames || {};
          this.cityDetails = parsedCache.cityDetails || {};
        } else {
          localStorage.removeItem("placeDataCache"); // Clear cache after 30 days to force a fresh fetch
        }
      } else {
        localStorage.setItem("pdcLastUpdated", Date.now().toString());
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }

  saveToLocalStorage() {
    try {
      const data = {
        cityNames: toJS(this.cityNames),
        cityDetails: toJS(this.cityDetails) // Save detailed location data
      };
      localStorage.setItem("placeDataCache", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  async fetchCityDetails(cityId: string) {
    console.log("$$$$$ Fetching city details for:", cityId);

    if (cityId) {
      try {
        const response = await fetch(`/api/getPlaceDetails?placeId=${cityId}`);
        const data = await response.json();

        if (data.result) {
          this.cityNames[cityId] = this.formatCityAndStatefromAddress(
            data.result.address_components
          );
          this.cityDetails[cityId] = data.result;
        }

        this.saveToLocalStorage();
      } catch (error) {
        console.error("Failed to fetch city details:", error);
      }
    }

    return null;
  }

  formatCountryNameFromISOCode(isoCode: string) {
    const displayNames = new Intl.DisplayNames([navigator.language || "en"], {
      type: "region"
    });
    return displayNames.of(isoCode.toUpperCase());
  }

  initUserMap() {
    this.userMap = new UserMapState(
      this.userList.users,
      this.userList.usersByCountry,
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
        city = component.long_name;
      } else if (component.types.includes("sublocality") && !city) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
    });

    if (!city) {
      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_2")) {
          city = component.long_name;
        }
      });
    }

    if (city === state) {
      state = "";
    }

    if (
      state &&
      countriesWithState.includes(countryCodeFromAddressComponents)
    ) {
      return `${city}, ${state}`;
    }

    return city;
  }

  addCountryToList(isoCode: string) {
    if (!this.countryNames[isoCode]) {
      this.countryNames[isoCode] =
        this.formatCountryNameFromISOCode(isoCode) || "";
    }

    this.saveToLocalStorage();
  }
}

const appState = new AppState();
export default appState;
