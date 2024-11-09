import { getCountryNameByLocale } from "@/lib/clientUtils";
import { DocumentData } from "firebase/firestore";
import { makeAutoObservable, toJS } from "mobx";

type CountryUsersType = {
  countryName: string;
  cities: Record<string, DocumentData[]>;
};

class PeopleState {
  isFetched = false;
  viewingBy = "name";
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};

  constructor() {
    makeAutoObservable(this);
  }

  async init(users: DocumentData[], viewingBy: string) {
    this.users = users;
    this.setViewingBy(viewingBy);
    this.usersByCountry = {};
    // calculate users by country
    this.users.forEach((user) => {
      let { countryAbbr, cityId } = user;

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

    this.usersByBirthday = {};
    // calculate users by birthday
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

    this.setIsFetched(true);
  }

  setIsFetched(isFetched: boolean) {
    this.isFetched = isFetched;
  }

  setViewingBy(viewingBy: string) {
    this.viewingBy = viewingBy;
  }
}

export default new PeopleState();
