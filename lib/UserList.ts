import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import { PeopleViews } from "@/app/people/PeopleList";
import appState from "./AppState";

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

  setUsers(
    users: DocumentData[],
    cityNames: Record<string, string>,
    countryNames: Record<string, string>
  ) {
    if (!users) return;
    this.users = users;
    this.setUsersByCountry(users, countryNames);
    this.setUsersByBirthday(users);
  }

  setFilteredUsers(
    users: DocumentData[],
    cityNames: Record<string, string>,
    countryNames: Record<string, string>
  ) {
    this.filteredUsers = users;
    this.setUsersByCountry(users, countryNames);
    this.setUsersByBirthday(users);
    appState.userMap?.updateMarkerVisibility(users);
  }

  setUsersByCountry(
    users: DocumentData[],
    countryNames: Record<string, string>
  ) {
    this.usersByCountry = {};
    users.forEach((user) => {
      const countryAbbr = user.countryAbbr;
      const cityId = user.cityId || "No city listed";

      if (!this.usersByCountry[countryAbbr]) {
        this.usersByCountry[countryAbbr] = {
          countryName: countryNames[countryAbbr] || "",
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
    this.usersByBirthday = {};
    users.forEach((user) => {
      if (!user.birthday) return;
      const [, month, day] = user.birthday.split("-");
      if (!this.usersByBirthday[month]) {
        this.usersByBirthday[month] = {
          [day]: [user]
        };
      } else if (!this.usersByBirthday[month][day]) {
        this.usersByBirthday[month][day] = [user];
      } else {
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
    cityNames: Record<string, string>,
    countryNames: Record<string, string>
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

    this.debounceTimeout = setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase().trim();

      if (!lowerCaseQuery) {
        this.setFilteredUsers(this.users, cityNames, countryNames);
        return;
      }

      const result = this.users.filter((user) => {
        const matchesField = fieldsToSearch.some((key) =>
          String(user[key]).toLowerCase().includes(lowerCaseQuery)
        );

        const fullName = `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();
        const matchesFullName = fullName.toLowerCase().includes(lowerCaseQuery);

        const cityId = user.cityId || "";
        const countryAbbr = user.countryAbbr || "";

        const cityName =
          cityId && cityNames[cityId] ? cityNames[cityId].toLowerCase() : "";
        const cName =
          countryAbbr && countryNames[countryAbbr]
            ? countryNames[countryAbbr].toLowerCase()
            : "";

        const matchesLocation =
          cityName.includes(lowerCaseQuery) || cName.includes(lowerCaseQuery);

        if (
          viewingBy === PeopleViews.LOCATION ||
          viewingBy === PeopleViews.MAP
        ) {
          return matchesField || matchesFullName || matchesLocation;
        } else {
          return matchesField || matchesFullName;
        }
      });

      this.setFilteredUsers(result, cityNames, countryNames);
    }, 300);
  }
}

const userList = new UserList();
export default userList;
