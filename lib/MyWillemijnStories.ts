import { DocumentData } from "firebase-admin/firestore";
import { makeAutoObservable } from "mobx";
import appState from "./AppState";

export class MyWillemijnStories {
  allStories: DocumentData[] = [];
  filteredStories: DocumentData[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init(stories: DocumentData[]) {
    this.allStories = stories;
    this.filteredStories = stories;
  }

  setAllStories(stories: DocumentData[]) {
    this.allStories = stories;
  }

  updateFilteredStories() {
    const filteredStories = this.allStories.filter((story) => {
      return (
        story.storyContent
          .toLowerCase()
          .includes(appState.userList.query.toLowerCase()) ||
        appState.userList.filteredUsers.some((user) => {
          return user.id === story.authorId;
        })
      );
    });

    this.filteredStories = filteredStories;
  }
}

const myWillemijnStories = new MyWillemijnStories();
export default myWillemijnStories;
