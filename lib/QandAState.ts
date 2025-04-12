import { CommentType } from "@/components/Comments/Comment";
import { ReactionType } from "@/components/Reactions/Reactions";
import { Timestamp } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

// export type AnswerType = {
//   id: string;
//   authorId: string;
//   createdAt: string;
//   text: string;
//   reactions: ReactionType[];
// };

export type QandADocType = {
  id: string;
  question: string;
  creatorId: string;
  createdAt: Timestamp;
  answers: CommentType[];
};

export class QandAState {
  isInitialized = false;
  qAndA: QandADocType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setQandA(qAndA: QandADocType[]) {
    this.qAndA = qAndA.sort(
      (a, b) => b.createdAt.seconds - a.createdAt.seconds
    );
    this.isInitialized = true;
  }
}
const qAndAState = new QandAState();
export default qAndAState;
