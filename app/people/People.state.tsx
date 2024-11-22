import { DocumentData } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

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
  usersByBirthday: Record<string, Record<string, DocumentData[]>> = {};
  cityNames: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this);
  }

  async init(users: DocumentData[], viewingBy: PeopleViews) {
    this.users = users;

    this.setViewingBy(viewingBy);

    this.initUsersByBirthday();

    this.setIsFetched(true);
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

  setIsFetched(isFetched: boolean) {
    this.isFetched = isFetched;
  }

  setViewingBy(viewingBy: PeopleViews) {
    this.viewingBy = viewingBy;
  }
}

const peopleState = new PeopleState();
export default peopleState;
