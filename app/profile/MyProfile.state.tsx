import { fetchCityName, fetchCountryInfo } from "@/lib/clientUtils";
import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

class MyProfileState {
  isFetched = false;
  user: DocumentData | null = null;
  placeId: string | null = null;
  cityName: string | null = null;
  countryName: string | null = null;
  countryAbbr: string | null = null;
  myWillemijnStory: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async init(user: DocumentData) {
    this.setUser(user);
    this.setPlaceId(user.cityId);
    const cityName = await fetchCityName(user);
    this.setCityName(cityName);
    this.setCountryAbbr(user.countryAbbr);
    this.setCountryName(user.countryName);
    this.setMyWillemijnStory(user.myWillemijnStory);
    this.setIsFetched(true);
  }

  setIsFetched(isFetched: boolean) {
    this.isFetched = isFetched;
  }

  setUser(user: DocumentData | null) {
    this.user = user;
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

  setCountryName(countryName: string | null) {
    this.countryName = countryName;
  }

  setCountryNameFromPlaceId(placeId: string | null) {
    if (!placeId) {
      this.setCountryName(null);
      return;
    }
    fetchCountryInfo(placeId).then(({ countryName }) => {
      this.setCountryName(countryName);
    });
  }

  setMyWillemijnStory(myWillemijnStory: string | null) {
    this.myWillemijnStory = myWillemijnStory;
  }
}

export default new MyProfileState();
