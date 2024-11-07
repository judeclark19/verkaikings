import { getCountryNameByLocale } from "@/lib/clientUtils";
import { DocumentData } from "firebase/firestore";
import { makeAutoObservable, toJS } from "mobx";

type CountryUsersType = {
  countryName: string;
  cities: Record<string, DocumentData[]>;
};

type BirthMonthUsersType = {
  day: string;
  users: DocumentData[];
};

// {
//     05: {
//         01: [user1, user2, user3],
//         02: [user4, user5]
//     },
//     06: {
//         01: [user6, user7],
//         02: [user8, user9]
//     }
// }

class DemographicsState {
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};

  constructor() {
    makeAutoObservable(this);
  }

  async init(users: DocumentData[]) {
    this.users = users;

    this.usersByCountry = {};
    // calculate users by country
    this.users.forEach((user) => {
      const { countryAbbr, cityId } = user;

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

      //   if (!this.usersByCountry[user.countryAbbr]) {
      //     this.usersByCountry[user.countryAbbr] = {
      //       countryName:
      //         getCountryNameByLocale(user.countryAbbr.toUpperCase()) || "",
      //       cities: {},
      //       users: []
      //     };
      //   }
      //   this.usersByCountry[user.countryAbbr].users.push(user);
    });

    this.usersByBirthday = {};
    // calculate users by birthday
    this.users.forEach((user) => {
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
    console.log("BIRTHDAY LIST", toJS(this.usersByBirthday));
  }
}

export default new DemographicsState();
