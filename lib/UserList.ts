import { DocumentData } from "firebase/firestore";
import { makeAutoObservable, toJS } from "mobx";
import appState, { CountryUsersType } from "./AppState";

export class UserList {
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};

  constructor() {
    console.log("UserList constructor");
    makeAutoObservable(this);
  }

  init(users: DocumentData[]) {
    console.log("UserList init", toJS(users));
    this.users = users;
  }

  setUsers(users: DocumentData[]) {
    this.users = users;
    this.getUsersByCountry();
    this.getUsersByBirthday();
  }

  getUsersByCountry() {
    this.usersByCountry = {};
    this.users.forEach((user) => {
      const countryAbbr = user.countryAbbr;
      let cityId = user.cityId;

      if (!cityId) cityId = "No city listed";

      if (!this.usersByCountry[countryAbbr]) {
        this.usersByCountry[countryAbbr] = {
          countryName: appState.countryNames[countryAbbr] || "",
          cities: {
            [cityId]: [user]
          }
        };
      } else if (!this.usersByCountry[countryAbbr].cities[cityId]) {
        this.usersByCountry[countryAbbr].cities[cityId] = [user];
      } else {
        this.usersByCountry[countryAbbr].cities[cityId].push(user);
      }
    });

    appState.initUserMap();
  }

  getUsersByBirthday() {
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
}

const userList = new UserList();
export default userList;
