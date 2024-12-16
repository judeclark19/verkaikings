import appState from "@/lib/AppState";
import { db } from "@/lib/firebase";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import notificationsState, {
  NotificationsState
} from "../notifications/Notifications.state";

export class MyProfileState {
  isFetched = false;
  user: DocumentData | null = null;
  userId: string | null = null;
  placeId: string | null = null;
  cityName: string | null = null;
  countryAbbr: string | null = null;
  countryName: string | null = null;
  email: string | null = null;
  instagram: string | null = null;
  tiktok: string | null = null;
  duolingo: string | null = null;
  beReal: string | null = null;
  pronouns: string | null = null;
  myWillemijnStory: string | null = null;
  notificationsState: NotificationsState | null = null;
  // notifications: DocumentData[] = [];
  // unsubscribeNotifications: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async init(user: DocumentData, userId: string) {
    await appState.waitForInitialization(); // Ensure appState is ready

    this.setUser(user);
    this.setUserId(userId);
    this.setPlaceId(user.cityId);
    this.setCityName(appState.cityNames[user.cityId]);
    this.setCountryAbbr(user.countryAbbr);
    this.setCountryName(user.countryAbbr);
    this.setEmail(user.email);
    this.setInstagram(user.instagram);
    this.setTiktok(user.tiktok);
    this.setDuolingo(user.duolingo);
    this.setBeReal(user.beReal);
    this.setPronouns(user.pronouns);

    this.notificationsState = notificationsState;
    this.notificationsState.subscribeToNotifications(userId);

    this.setMyWillemijnStory(
      appState.myWillemijnStories.allStories.find(
        (story) => story.authorId === userId
      )?.storyContent
    );
    this.setIsFetched(true);
  }

  setIsFetched(isFetched: boolean) {
    this.isFetched = isFetched;
  }

  setUser(user: DocumentData | null) {
    this.user = user;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  setPlaceId(placeId: string | null) {
    this.placeId = placeId;
  }

  setCityName(cityName: string | null) {
    this.cityName = cityName;
  }

  setCountryAbbr(countryAbbr: string | null) {
    this.countryAbbr = countryAbbr;
  }

  setCountryName(countryAbbr: string | null) {
    if (!countryAbbr) {
      return "";
    }

    if (!appState.countryNames[countryAbbr]) {
      appState.addCountryToList(countryAbbr);
    }

    this.countryName = appState.countryNames[countryAbbr];
  }

  setEmail(email: string | null) {
    this.email = email;
  }

  setInstagram(instagram: string | null) {
    this.instagram = instagram;
  }

  setTiktok(tiktok: string | null) {
    this.tiktok = tiktok;
  }

  setDuolingo(duolingo: string | null) {
    this.duolingo = duolingo;
  }

  setBeReal(beReal: string | null) {
    this.beReal = beReal;
  }

  setPronouns(pronouns: string | null) {
    this.pronouns = pronouns;
  }

  setMyWillemijnStory(myWillemijnStory: string | null) {
    this.myWillemijnStory = myWillemijnStory;
  }

  signOut() {
    this.notificationsState?.unsubscribeFromNotifications();

    this.setUser(null);
    this.setUserId(null);
    this.setPlaceId(null);
    this.setCityName(null);
    this.setCountryAbbr(null);
    this.setCountryName(null);
    this.setInstagram(null);
    this.setTiktok(null);
    this.setEmail(null);
    this.setDuolingo(null);
    this.setBeReal(null);
    this.setPronouns(null);
    this.setMyWillemijnStory(null);
    this.setIsFetched(false);
  }
}

const myProfileState = new MyProfileState();
export default myProfileState;
