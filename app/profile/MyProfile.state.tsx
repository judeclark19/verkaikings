import appState from "@/lib/AppState";
import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

class MyProfileState {
  isFetched = false;
  user: DocumentData | null = null;
  userId: string | null = null;
  placeId: string | null = null;
  cityName: string | null = null;
  countryAbbr: string | null = null;
  countryName: string | null = null;
  instagram: string | null = null;
  myWillemijnStory: string | null = null;

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
    this.setInstagram(user.instagram);
    this.setMyWillemijnStory(user.myWillemijnStory);
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

  setInstagram(instagram: string | null) {
    this.instagram = instagram;
  }

  setMyWillemijnStory(myWillemijnStory: string | null) {
    this.myWillemijnStory = myWillemijnStory;
  }

  signOut() {
    this.setUser(null);
    this.setUserId(null);
    this.setPlaceId(null);
    this.setCityName(null);
    this.setCountryAbbr(null);
    this.setCountryName(null);
    this.setInstagram(null);
    this.setMyWillemijnStory(null);
    this.setIsFetched(false);
  }
}

const myProfileState = new MyProfileState();
export default myProfileState;
