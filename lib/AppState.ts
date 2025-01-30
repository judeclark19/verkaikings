import myProfileState from "@/app/profile/MyProfile.state";
import { makeAutoObservable, toJS } from "mobx";
import userList, { UserDocType, UserList } from "./UserList";
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
import myWillemijnStories, {
  MyWillemijnStories,
  StoryDocType
} from "./MyWillemijnStories";
import { registerPushNotifications } from "./clientUtils";
import eventsState, { EventDocType, Events } from "@/app/events/Events.state";
import fundraiserState, {
  FundraiserDocType,
  FundraiserState
} from "./FundraiserState";
import qAndAState, { QandADocType, QandAState } from "./QandAState";
import userMap, { UserMapState } from "@/app/people/UserMap/UserMap.state";

class AppState {
  isInitialized = false;
  language: string = "en";
  dayJsLocale: string = "en";

  loggedInUser: UserDocType | null = null;
  cityNames: Record<string, string> = {};
  cityDetails: Record<string, google.maps.places.PlaceResult> = {};
  countryNames: Record<string, string> = {};

  snackbarOpen = false;
  snackbarMessage = "";

  userList: UserList = userList;
  userMap: UserMapState = userMap;
  myWillemijnStories: MyWillemijnStories = myWillemijnStories;
  events: Events = eventsState;
  fundraisers: FundraiserState = fundraiserState;
  qAndA: QandAState = qAndAState;

  initPromise: Promise<void> | null = null;
  userUnsubscribe: (() => void) | null = null;
  storyUnsubscribe: (() => void) | null = null;
  eventsUnsubscribe: (() => void) | null = null;
  fundraisersUnsubscribe: (() => void) | null = null;
  qAndAUnsubscribe: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async initializeSnapshots(isLoggedIn: boolean, userId?: string) {
    if (isLoggedIn) {
      if (!this.isInitialized) {
        const users = await getDocs(collection(db, "users"));
        const stories = await getDocs(collection(db, "myWillemijnStories"));
        const events = await getDocs(collection(db, "events"));
        const fundraisers = await getDocs(collection(db, "fundraisers"));
        const qAndA = await getDocs(collection(db, "qanda"));
        this.init(
          users.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as UserDocType)
          ),
          userId!,
          stories.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as StoryDocType)
          ),
          events.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as EventDocType)
          ),
          fundraisers.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as FundraiserDocType)
          ),
          qAndA.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as QandADocType)
          )
        );
      }
      this.subscribeToUsers();
      this.subscribeToStories();
      this.subscribeToEvents();
      this.subscribeToFundraisers();
      this.subscribeToQandA();
    } else {
      this.unsubscribeFromSnapshots();
    }
  }

  async init(
    users: UserDocType[],
    userId: string,
    stories: StoryDocType[],
    events: EventDocType[],
    fundraisers: FundraiserDocType[],
    qAndA: QandADocType[]
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
      // this.language = "nl-NL";
      this.userList = userList;
      this.userList.init(users);

      this.myWillemijnStories = myWillemijnStories;
      this.myWillemijnStories.init(stories);
      this.events = eventsState;
      this.events.setAllEvents(events);
      this.fundraisers = fundraiserState;
      this.fundraisers.setFundraisers(fundraisers);
      this.qAndA = qAndAState;
      this.qAndA.setQandA(qAndA);

      this.loggedInUser = users.find((user) => user.id === userId) || null;
      await this.loadPDCfromDB();

      registerPushNotifications().catch(console.error);
      await requestNotificationPermission(userId);

      // Fetch city names and details
      const cityIdsOfUsers = users
        .filter((user) => user.cityId)
        .map((user) => user.cityId);

      for (const cityIdOfUser of cityIdsOfUsers) {
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

      this.userMap = userMap;
      this.userMap.init(users);

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
      const updatedUsers = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data()
          } as UserDocType)
      );
      this.userList.setUsers(updatedUsers);
    });
  }

  subscribeToStories() {
    this.storyUnsubscribe = onSnapshot(
      collection(db, "myWillemijnStories"),
      (snapshot) => {
        const updatedStories = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data()
            } as StoryDocType)
        );
        this.myWillemijnStories.setAllStories(updatedStories);
        this.myWillemijnStories.updateFilteredStories();
      }
    );
  }

  subscribeToEvents() {
    this.eventsUnsubscribe = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const updatedEvents = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data()
            } as EventDocType)
        );
        this.events.setAllEvents(updatedEvents);
      }
    );
  }

  subscribeToFundraisers() {
    this.fundraisersUnsubscribe = onSnapshot(
      collection(db, "fundraisers"),
      (snapshot) => {
        const fundraisersData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data()
            } as FundraiserDocType)
        );
        this.fundraisers.setFundraisers(fundraisersData);
      }
    );
  }

  subscribeToQandA() {
    this.qAndAUnsubscribe = onSnapshot(collection(db, "qanda"), (snapshot) => {
      const qAndAData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data()
          } as QandADocType)
      );
      this.qAndA.setQandA(qAndAData);
    });
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
    if (this.fundraisersUnsubscribe) {
      this.fundraisersUnsubscribe();
      this.fundraisersUnsubscribe = null;
    }
    if (this.qAndAUnsubscribe) {
      this.qAndAUnsubscribe();
      this.qAndAUnsubscribe = null;
    }
  }

  async loadPDCfromDB() {
    console.log("Loading place data cache from database...", this.language);
    try {
      // const pdcDocRef = doc(db, "placeDataCache", this.language);
      const pdcDocRef = doc(db, "placeDataCache", "new");
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

      // const pdcDocRef = doc(db, "placeDataCache", this.language);
      const pdcDocRef = doc(db, "placeDataCache", "new");
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

        if (data.addressComponents) {
          this.cityNames[cityId] = this.formatCityAndStatefromAddress(
            data.addressComponents
          );
          this.cityDetails[cityId] = data;
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

  formatCityAndStatefromAddress(
    addressComponents: {
      longText: string;
      shortText: string;
      types: string[];
      languageCode: string;
    }[]
  ) {
    let city = "";
    let state = "";

    const countriesWithState = ["US", "CA", "AU", "BR", "AR", "MX", "IN"];
    const countryComponent = addressComponents.find((component) =>
      component.types.includes("country")
    );
    const countryCodeFromAddressComponents = countryComponent
      ? countryComponent.shortText
      : "";

    addressComponents.forEach((component) => {
      if (component.types.includes("locality")) {
        city = component.longText;
      } else if (component.types.includes("sublocality") && !city) {
        city = component.longText;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.shortText;
      }
    });

    if (!city) {
      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_2")) {
          city = component.longText;
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

  setSnackbarMessage(message: string) {
    this.snackbarMessage = message;
    this.setSnackbarOpen(true);

    // set timeout 3 seconds
    setTimeout(() => {
      this.setSnackbarOpen(false);
    }, 3000);
  }

  setSnackbarOpen(open: boolean) {
    this.snackbarOpen = open;
  }

  setLanguage(language: string) {
    this.language = language;
  }

  setDayJsLocale(locale: string) {
    this.dayJsLocale = locale;
  }
}

const appState = new AppState();
export default appState;
