import { makeAutoObservable } from "mobx";
import appState from "./AppState";
import { ReactionType } from "@/components/Reactions/Reactions";

export type StoryCommentType = {
  id: string;
  authorId: string;
  createdAt: string;
  text: string;
};

export type StoryDocType = {
  id: string;
  authorId: string;
  storyContent: string;
  createdAt: string;
  comments: StoryCommentType[];
  reactions: ReactionType[];
};

export class MyWillemijnStories {
  allStories: StoryDocType[] = [];
  filteredStories: StoryDocType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init(stories: StoryDocType[]) {
    this.allStories = stories;
    this.filteredStories = stories;
  }

  setAllStories(stories: StoryDocType[]) {
    this.allStories = stories;
  }

  updateFilteredStories() {
    const filteredStories = this.allStories.filter((story) => {
      return (
        (story.storyContent
          .toLowerCase()
          .includes(appState.userList.query.toLowerCase()) ||
          appState.userList.filteredUsers.some((user) => {
            return user.id === story.authorId;
          })) &&
        story.storyContent
      );
    });

    this.filteredStories = filteredStories;
  }
}

const myWillemijnStories = new MyWillemijnStories();
export default myWillemijnStories;
