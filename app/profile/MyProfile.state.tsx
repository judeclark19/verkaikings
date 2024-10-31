import { fetchCityName } from "@/lib/clientUtils";
import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

class MyProfileState {
  user: DocumentData | null = null;
  cityName: string | null = null;

  constructor() {
    makeAutoObservable(this);
    // this.init();
  }

  async init(user: DocumentData) {
    this.user = user;
    this.cityName = await fetchCityName(user);

    console.log("init my profile state", this.user, this.cityName);
  }

  setCityName(cityName: string | null) {
    this.cityName = cityName;
  }
}

export default new MyProfileState();
