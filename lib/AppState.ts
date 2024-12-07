import UserMapState from "@/app/people/UserMap/UserMap.state";
import myProfileState from "@/app/profile/MyProfile.state";
import { DocumentData } from "firebase-admin/firestore";
import { makeAutoObservable } from "mobx";
import userList from "./UserList";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

class AppState {
  isInitialized = false;
  loggedInUser: DocumentData | null = null;
  cityNames: Record<string, string> = {};
  cityDetails: Record<string, google.maps.places.PlaceResult> = {};
  countryNames: Record<string, string> = {};
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
      userList.init(users);
      this.loggedInUser = users.find((user) => user.id === userId) || null;
      const language = navigator.language || "en";

      // Extract city and country arrays
      const cityIds = users.map((user) => user.cityId);
      const countryISOs = users.map((user) => user.countryAbbr);

      // Parallel city fetches
      const cityFetchPromises = cityIds
        .filter((cityId): cityId is string => !!cityId)
        .map(async (cityId) => {
          // If we already have data, skip
          if (this.cityNames[cityId] && this.cityDetails[cityId]) return;

          const cityData = await this.getCityDetailsFromDB(cityId, language);
          if (cityData) {
            this.cityNames[cityId] = cityData.name;
            this.cityDetails[cityId] = cityData.details;
          } else {
            await this.fetchCityDetailsFromAPI(cityId);
          }
        });

      // Parallel country fetches
      const countryFetchPromises = countryISOs
        .filter((iso): iso is string => !!iso)
        .map(async (iso) => {
          // If we already have a country name, skip
          if (this.countryNames[iso]) return;

          const dbCountryName = await this.getCountryNameFromDB(iso, language);
          if (dbCountryName) {
            this.countryNames[iso] = dbCountryName;
          } else {
            const computedName = this.formatCountryNameFromISOCode(iso);
            if (computedName) {
              this.countryNames[iso] = computedName;
              await this.saveCountryToDB(iso, computedName, language);
            }
          }
        });

      // Wait for all parallel operations to complete
      await Promise.all([...cityFetchPromises, ...countryFetchPromises]);

      // Now that cities and countries are fetched, set up the user lists
      userList.setUsersByCountry(users, this.countryNames);
      userList.setUsersByBirthday(users);
      myProfileState.init(this.loggedInUser!, userId);
      this.initUserMap();
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

  async fetchCityDetailsFromAPI(cityId: string) {
    console.log("$$$$$ Fetching city details for:", cityId);

    if (cityId) {
      try {
        const language = navigator.language || "en"; // Use browser locale or fallback to English
        const response = await fetch(
          `/api/getPlaceDetails?placeId=${cityId}&language=${language}`
        );
        const data = await response.json();

        if (data.result) {
          this.cityNames[cityId] = this.formatCityAndStatefromAddress(
            data.result.address_components
          );
          this.cityDetails[cityId] = data.result;

          // Save the fetched data to Firestore
          await this.saveCityDetailsToDB(cityId, language, {
            name: this.cityNames[cityId],
            details: this.cityDetails[cityId]
          });
        }
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
    this.userMap = new UserMapState(userList.users, this.cityNames);
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
  }

  async getCityDetailsFromDB(cityId: string, language: string) {
    const docRef = doc(db, "cities", cityId, "translations", language);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    if (!data) {
      return null; // Just in case, but this should never happen if snapshot.exists() is true
    }

    const lastUpdated =
      data.lastUpdated && "toMillis" in data.lastUpdated
        ? data.lastUpdated.toMillis()
        : 0;

    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;

    if (Date.now() - lastUpdated > ninetyDaysInMs) {
      // Data is stale, return null to trigger API fetch
      return null;
    }

    return data;
  }

  async saveCityDetailsToDB(
    cityId: string,
    language: string,
    data: {
      name: string;
      details: google.maps.places.PlaceResult;
    }
  ) {
    const docRef = doc(db, "cities", cityId, "translations", language);
    await setDoc(docRef, {
      ...data,
      lastUpdated: serverTimestamp()
    });
  }

  async getCountryNameFromDB(
    isoCode: string,
    language: string
  ): Promise<string | null> {
    const docRef = doc(db, "countries", isoCode, "translations", language);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    if (!data) {
      return null;
    }

    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
    const lastUpdated = data.lastUpdated?.toMillis
      ? data.lastUpdated.toMillis()
      : 0;
    if (Date.now() - lastUpdated > ninetyDaysInMs) {
      return null; // Force re-fetch if stale
    }

    return data.name || null;
  }

  async saveCountryToDB(isoCode: string, name: string, language: string) {
    const docRef = doc(db, "countries", isoCode, "translations", language);
    await setDoc(docRef, {
      name,
      lastUpdated: serverTimestamp()
    });
  }
}

const appState = new AppState();
export default appState;
