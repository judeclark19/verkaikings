import { makeAutoObservable } from "mobx";
import appState from "./AppState";
import { PeopleViews } from "@/app/people/PeopleList";
import { addYearToBirthday } from "./clientUtils";
import userMap from "@/app/people/UserMap/UserMap.state";

type CountryUsersType = {
  countryName: string;
  cities: Record<string, UserDocType[]>;
};

export type UserDocType = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  cityId: string | "";
  countryAbbr: string;
  birthday: string | null;
  profilePicture: string | null;
  email: string;
  instagram: string | null;
  tiktok: string | null;
  duolingo: string | null;
  beReal: string | null;
  pronouns: string | null;
};

export class UserList {
  users: UserDocType[] = [];
  usersByCountry: Record<string, CountryUsersType> = {};
  usersByBirthday: Record<string, Record<string, UserDocType[]>> = {};
  filteredUsers: UserDocType[] = [];
  query = "";
  debounceTimeout: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  init(users: UserDocType[]) {
    this.users = users;
    this.filteredUsers = users;
  }

  setUsers(users: UserDocType[]) {
    if (!users) return;
    this.users = users;

    // Fetch city details for any new city IDs
    if (Object.keys(appState.cityNames).length > 0) {
      users.forEach((user) => {
        if (user.cityId && !appState.cityNames[user.cityId]) {
          appState.fetchCityDetails(user.cityId); // Fetch details for new city
        }
      });
    }

    this.setUsersByCountry(users);
    this.setUsersByBirthday(users);

    userMap.init(users);
  }

  setFilteredUsers(users: UserDocType[]) {
    this.filteredUsers = users;
    this.setUsersByCountry(users);
    this.setUsersByBirthday(users);
    appState.myWillemijnStories.updateFilteredStories();
    appState.userMap?.updateMarkerVisibility(users);
  }

  setUsersByCountry(users: UserDocType[]) {
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

  setUsersByBirthday(users: UserDocType[]) {
    // INIT USERS BY BIRTHDAY
    this.usersByBirthday = {};

    users.forEach((user) => {
      if (!user.birthday) return;
      const birthday = addYearToBirthday(user.birthday);

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
    const fieldsToSearch: (keyof UserDocType)[] = [
      "firstName",
      "lastName",
      "username"
    ];
    if (viewingBy === PeopleViews.NAME) {
      fieldsToSearch.push("phoneNumber");
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
          let cityName;
          if (user.cityId) {
            cityName = appState.cityNames[user.cityId]?.toLowerCase() || "";
          } else {
            cityName = "";
          }
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
