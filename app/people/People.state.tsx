import {
  getCountryNameByLocale,
  getFullLocationNameByPlaceId
} from "@/lib/clientUtils";
import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import UserMapState from "./UserMap/UserMap.state";

export type CountryUsersType = {
  countryName: string;
  cities: Record<string, DocumentData[]>;
};

export enum PeopleViews {
  NAME = "name",
  BIRTHDAY = "birthday",
  LOCATION = "location",
  MAP = "map"
}

class PeopleState {
  isFetched = false;
  viewingBy = PeopleViews.NAME;
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};
  userMap: UserMapState | null = null;
  locationNames: Record<string, string> = {};
  cityNames: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this);
  }

  async init(users: DocumentData[], viewingBy: PeopleViews) {
    this.users = users;

    this.initLocationAndCityNames();

    this.setViewingBy(viewingBy);

    this.initUsersByCountry();

    this.initUsersByBirthday();

    this.initUserMap(users);

    this.setIsFetched(true);
  }

  async initLocationAndCityNames() {
    // INIT LOCATION AND CITY NAMES
    for (const user of this.users) {
      if (!this.locationNames[user.cityId]) {
        try {
          const { locationName, cityName } = await getFullLocationNameByPlaceId(
            user.cityId
          );
          this.locationNames[user.cityId] = locationName;
          this.cityNames[user.cityId] = cityName;
        } catch (error) {
          console.error(`Failed to fetch city name for ${user.cityId}:`, error);
        }
      }
    }
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
          countryName: getCountryNameByLocale(countryAbbr.toUpperCase()) || "",
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
  }

  initUsersByBirthday() {
    // INIT USERS BY BIRTHDAY
    this.usersByBirthday = {};
    this.users.forEach((user) => {
      if (!user.birthday) return;
      const { birthday } = user;
      const month = birthday.split("-")[1];
      const day = birthday.split("-")[2];

      if (!this.usersByBirthday[month]) {
        // init month object
        this.usersByBirthday[month] = {
          [day]: [user]
        };
      } else if (
        this.usersByBirthday[month] &&
        !this.usersByBirthday[month][day]
      ) {
        // init day object
        this.usersByBirthday[month][day] = [user];
      } else if (
        this.usersByBirthday[month] &&
        this.usersByBirthday[month][day]
      ) {
        // add user to day
        this.usersByBirthday[month][day].push(user);
      }
    });
  }

  initUserMap(users: DocumentData[]) {
    // INIT USER MAP
    this.userMap = new UserMapState(
      users,
      this.usersByCountry,
      this.locationNames
    );
  }

  setIsFetched(isFetched: boolean) {
    this.isFetched = isFetched;
  }

  setViewingBy(viewingBy: PeopleViews) {
    this.viewingBy = viewingBy;
  }
}

const peopleState = new PeopleState();
export default peopleState;
