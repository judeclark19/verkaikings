import { CountryUsersType } from "@/app/people/People.state";
import UserMapState from "@/app/people/UserMap/UserMap.state";
import { DocumentData } from "firebase-admin/firestore";
import { makeAutoObservable, toJS } from "mobx";
class PlaceDataCache {
  isInitialized = false;
  users: DocumentData[] = [];
  cityNames: Record<string, string> = {};
  cityDetails: Record<string, google.maps.places.PlaceResult> = {};
  countryNames: Record<string, string> = {};
  usersByCountry: Record<string, CountryUsersType> = {};
  userMap: UserMapState | null = null;
  initPromise: Promise<void> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async init(users: DocumentData[]) {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      await this.initPromise; // Wait for any ongoing initialization
      return;
    }

    this.initPromise = (async () => {
      this.loadFromLocalStorage();
      this.users = users;

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

      this.initUsersByCountry();
      this.saveToLocalStorage();
      this.isInitialized = true;
    })();

    await this.initPromise;
  }

  async waitForInitialization() {
    if (this.isInitialized) return;
    if (this.initPromise) await this.initPromise;
  }

  setUsers(users: DocumentData[]) {
    this.users = users;
    this.initUsersByCountry();
  }
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem("placeDataCache");

      if (stored) {
        const parsed = JSON.parse(stored);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        if (Date.now() - parsed.lastUpdated <= oneMonthInMs) {
          this.cityNames = parsed.cityNames || {};
          this.cityDetails = parsed.cityDetails || {};
        } else {
          localStorage.removeItem("placeDataCache"); // Clear outdated data
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }

  saveToLocalStorage() {
    try {
      const data = {
        cityNames: toJS(this.cityNames),
        cityDetails: toJS(this.cityDetails), // Save detailed location data
        lastUpdated: Date.now()
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

  initUsersByCountry() {
    this.usersByCountry = {};
    this.users.forEach((user) => {
      const countryAbbr = user.countryAbbr;
      let cityId = user.cityId;

      if (!cityId) cityId = "No city listed";

      if (!this.usersByCountry[countryAbbr]) {
        this.usersByCountry[countryAbbr] = {
          countryName: this.countryNames[countryAbbr] || "",
          cities: {
            [cityId]: [user]
          }
        };
      } else if (!this.usersByCountry[countryAbbr].cities[cityId]) {
        this.usersByCountry[countryAbbr].cities[cityId] = [user];
      } else {
        this.usersByCountry[countryAbbr].cities[cityId].push(user);
      }
    });

    this.initUserMap();
  }

  initUserMap() {
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

const placeDataCache = new PlaceDataCache();
export default placeDataCache;
