import UserMapState from "@/app/people/UserMap/UserMap.state";
import myProfileState from "@/app/profile/MyProfile.state";
import { DocumentData } from "firebase-admin/firestore";
import { makeAutoObservable, toJS } from "mobx";
import userList, { UserList } from "./UserList";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db, requestNotificationPermission } from "./firebase";
import myWillemijnStories, { MyWillemijnStories } from "./MyWillemijnStories";
import { registerPushNotifications } from "./clientUtils";
import eventsState, { Events, EventType } from "@/app/events/Events.state";

class AppState {
  isInitialized = false;
  language: string = "en";
  userList: UserList = userList;
  myWillemijnStories: MyWillemijnStories = myWillemijnStories;
  events: Events = eventsState;
  loggedInUser: DocumentData | null = null;
  cityNames: Record<string, string> = {};
  cityDetails: Record<string, google.maps.places.PlaceResult> = {};
  countryNames: Record<string, string> = {};
  userMap: UserMapState | null = null;
  initPromise: Promise<void> | null = null;
  userUnsubscribe: (() => void) | null = null;
  storyUnsubscribe: (() => void) | null = null;
  eventsUnsubscribe: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async initializeSnapshots(isLoggedIn: boolean, userId?: string) {
    if (isLoggedIn) {
      if (!this.isInitialized) {
        const users = await getDocs(collection(db, "users"));
        const stories = await getDocs(collection(db, "myWillemijnStories"));
        const events = await getDocs(collection(db, "events"));
        this.init(
          users.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          userId!,
          stories.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          events.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
      this.subscribeToUsers();
      this.subscribeToStories();
      this.subscribeToEvents();
    } else {
      this.unsubscribeFromSnapshots();
    }
  }

  async init(
    users: DocumentData[],
    userId: string,
    stories: DocumentData[],
    events: DocumentData[]
  ) {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      await this.initPromise; // Wait for any ongoing initialization
      return;
    }

    this.initPromise = (async () => {
      this.language = navigator.language || "en";
      this.userList = userList;
      this.userList.init(users);
      this.myWillemijnStories = myWillemijnStories;
      this.myWillemijnStories.init(stories);
      this.events = eventsState;
      this.events.setAllEvents(events);
      this.loggedInUser = users.find((user) => user.id === userId) || null;
      await this.loadPDCfromDB();

      registerPushNotifications().catch(console.error);
      await requestNotificationPermission(userId);

      // Fetch city names and details
      const cityIdsOfUsers = users.map((user) => user.cityId);
      for (const cityIdOfUser of cityIdsOfUsers) {
        if (!cityIdOfUser) continue;

        if (!this.cityNames[cityIdOfUser] || !this.cityDetails[cityIdOfUser]) {
          await this.fetchCityDetails(cityIdOfUser);
        }
      }

      // Populate country names
      const countryISOs = users.map((user) => user.countryAbbr);
      for (const iso of countryISOs) {
        if (!iso || this.countryNames[iso]) continue;
        this.addCountryToList(iso);
      }

      this.userList.setUsersByCountry(users);

      if (!appState.userList.query) {
        this.userList.setUsersByBirthday(users);
      }
      this.setPDCinDB();
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

  subscribeToUsers() {
    this.userUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      this.userList.setUsers(updatedUsers);
    });
  }

  subscribeToStories() {
    this.storyUnsubscribe = onSnapshot(
      collection(db, "myWillemijnStories"),
      (snapshot) => {
        const updatedStories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        this.myWillemijnStories.setAllStories(updatedStories);
        this.myWillemijnStories.updateFilteredStories();
      }
    );
  }

  subscribeToEvents() {
    this.eventsUnsubscribe = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const updatedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        this.events.setAllEvents(updatedEvents);
      }
    );
  }

  unsubscribeFromSnapshots() {
    if (this.userUnsubscribe) {
      this.userUnsubscribe();
      this.userUnsubscribe = null;
    }
    if (this.storyUnsubscribe) {
      this.storyUnsubscribe();
      this.storyUnsubscribe = null;
    }
    if (this.eventsUnsubscribe) {
      this.eventsUnsubscribe();
      this.eventsUnsubscribe = null;
    }
  }

  async loadPDCfromDB() {
    console.log("Loading place data cache from database...", this.language);
    try {
      const pdcDocRef = doc(db, "placeDataCache", this.language);
      const pdcSnapshot = await getDoc(pdcDocRef);

      if (!pdcSnapshot.data()) {
        setDoc(pdcDocRef, { lastUpdated: serverTimestamp() });
        return;
      }

      if (!pdcSnapshot.data()?.lastUpdated) {
        updateDoc(pdcDocRef, { lastUpdated: serverTimestamp() });
        return;
      }

      const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

      if (
        Date.now() - pdcSnapshot.data()!.lastUpdated.toMillis() >
        threeMonthsInMs
      ) {
        // Clear the cache if it is older than 3 months
        setDoc(pdcDocRef, { lastUpdated: serverTimestamp() });
        return;
      }

      // Load cached data
      this.cityNames = JSON.parse(pdcSnapshot.data()?.cityNames) || {};
      // console.log("city names fetched from db:", toJS(this.cityNames));

      this.cityDetails = JSON.parse(pdcSnapshot.data()?.cityDetails) || {};
      // console.log(
      //   "city details fetched from db:",
      //   JSON.parse(pdcSnapshot.data()?.cityDetails)
      // );
    } catch (error) {
      console.error("Error loading from database:", error);
    }
  }

  setPDCinDB() {
    try {
      const data = {
        cityNames: toJS(this.cityNames),
        cityDetails: toJS(this.cityDetails) // Save detailed location data
      };

      const pdcDocRef = doc(db, "placeDataCache", this.language);
      updateDoc(pdcDocRef, {
        cityNames: JSON.stringify(data.cityNames),
        cityDetails: JSON.stringify(data.cityDetails)
      });
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  }

  async fetchCityDetails(cityId: string) {
    console.log("$$$$$ Fetching city details for:", cityId);
    if (!process.env.NEXT_PUBLIC_APP_SECRET) {
      throw new Error("NEXT_PUBLIC_APP_SECRET is not defined");
    }

    if (cityId) {
      try {
        const response = await fetch(
          `/api/getPlaceDetails?placeId=${cityId}&language=${this.language}`,
          {
            headers: {
              "x-app-secret": process.env.NEXT_PUBLIC_APP_SECRET
            }
          }
        );
        const data = await response.json();

        if (data.result) {
          this.cityNames[cityId] = this.formatCityAndStatefromAddress(
            data.result.address_components
          );
          this.cityDetails[cityId] = data.result;
        }

        this.setPDCinDB();
      } catch (error) {
        console.error("Failed to fetch city details:", error);
      }
    }

    return null;
  }

  formatCountryNameFromISOCode(isoCode: string) {
    const displayNames = new Intl.DisplayNames([this.language], {
      type: "region"
    });
    return displayNames.of(isoCode.toUpperCase());
  }

  initUserMap() {
    this.userMap = new UserMapState(this.userList.users, this.cityNames);
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

    this.setPDCinDB();
  }
}

const appState = new AppState();
export default appState;
