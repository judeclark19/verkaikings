import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import appState from "./AppState";
import { PeopleViews } from "@/app/people/PeopleList";
import { app } from "firebase-admin";

type CountryUsersType = {
  countryName: string;
  cities: Record<string, DocumentData[]>;
};

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

    // Fetch city details for any new city IDs
    if (Object.keys(appState.cityNames).length) {
      users.forEach((user) => {
        if (user.cityId && !appState.cityNames[user.cityId]) {
          appState.fetchCityDetails(user.cityId); // Fetch details for new city
        }
      });
    }

    this.setUsersByCountry(users);
    this.setUsersByBirthday(users);
    appState.initUserMap();
  }

  setFilteredUsers(users: DocumentData[]) {
    this.filteredUsers = users;
    this.setUsersByCountry(users);
    this.setUsersByBirthday(users);
    appState.myWillemijnStories.updateFilteredStories();
    appState.userMap?.updateMarkerVisibility(users);
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
  }

  filterUsersByQuery(
    query: string,
    viewingBy: PeopleViews,
    skipDebounce = false
  ) {
    const fieldsToSearch = ["firstName", "lastName", "username"];
    if (viewingBy === PeopleViews.NAME) {
      fieldsToSearch.push("phoneNumber");
    }

    if (viewingBy === PeopleViews.STORY) {
      fieldsToSearch.push("myWillemijnStory");
    }

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(
      () => {
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
          const matchesFullName = fullName
            .toLowerCase()
            .includes(lowerCaseQuery);

          // Check city and country names
          const cityName = appState.cityNames[user.cityId]?.toLowerCase() || "";
          const countryName =
            appState.countryNames[user.countryAbbr]?.toLowerCase() || "";
          const matchesLocation =
            cityName.includes(lowerCaseQuery) ||
            countryName.includes(lowerCaseQuery);

          if (
            viewingBy === PeopleViews.LOCATION ||
            viewingBy === PeopleViews.MAP
          ) {
            return matchesField || matchesFullName || matchesLocation;
          } else {
            return matchesField || matchesFullName;
          }
        });

        this.setFilteredUsers(result);
      },
      skipDebounce ? 0 : 300
    );
  }
}

const userList = new UserList();
export default userList;
