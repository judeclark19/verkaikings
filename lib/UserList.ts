import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import appState, { CountryUsersType } from "./AppState";

export class UserList {
  users: DocumentData[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};
  filteredUsers: DocumentData[] = [];
  query = "";
  debounceTimeout: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  init(users: DocumentData[]) {
    this.users = users;
    this.filteredUsers = users;
  }

  setUsers(users: DocumentData[]) {
    if (!users) return;
    this.users = users;
    this.setUsersByCountry(users);
    this.setUsersByBirthday(users);
  }

  setFilteredUsers(users: DocumentData[]) {
    this.filteredUsers = users;
    this.setUsersByCountry(users);
    this.setUsersByBirthday(users);
  }

  setUsersByCountry(users: DocumentData[]) {
    this.usersByCountry = {};
    users.forEach((user) => {
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

  setUsersByBirthday(users: DocumentData[]) {
    // INIT USERS BY BIRTHDAY
    this.usersByBirthday = {};

    users.forEach((user) => {
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

  setQuery(query: string) {
    this.query = query;
    // this.filterUsersByQuery(query);
  }

  filterUsersByQuery(query: string, includeStory?: boolean) {
    const fieldsToSearch = [
      "firstName",
      "lastName",
      "username",
      "email",
      "phoneNumber"
    ];

    if (includeStory) {
      fieldsToSearch.push("myWillemijnStory");
    }

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();

      if (!lowerCaseQuery.trim()) {
        this.setFilteredUsers(this.users);
        return;
      }

      const result = this.users.filter((user) => {
        // Check individual fields
        const matchesField = fieldsToSearch.some((key) =>
          String(user[key]).toLowerCase().includes(lowerCaseQuery)
        );

        // Check combined firstName + lastName
        const fullName = `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();
        const matchesFullName = fullName.toLowerCase().includes(lowerCaseQuery);

        return matchesField || matchesFullName;
      });

      this.setFilteredUsers(result);
    }, 300); // 300ms debounce
  }
}

const userList = new UserList();
export default userList;
