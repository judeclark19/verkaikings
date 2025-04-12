import { CommentType } from "@/components/Comments/Comment";
import appState from "@/lib/AppState";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

export type EventDocType = {
  id: string;
  creatorId: string;
  createdAt: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  locationUrl: string;
  externalLink: string;
  description: string;
  attendees: string[];
  comments: CommentType[];
};

export class Events {
  isInitialized = false;
  allEvents: EventDocType[] = [];
  pastEvents: EventDocType[] = [];
  upcomingEvents: EventDocType[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  setAllEvents(events: EventDocType[]) {
    this.allEvents = events;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.pastEvents = events
      .filter((event) => {
        const eventDate = new Date(event.date + "T00:00");
        return eventDate < today;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date + "T00:00");
        const bDate = new Date(b.date + "T00:00");
        return aDate > bDate ? -1 : 1;
      });

    this.upcomingEvents = events
      .filter((event) => {
        const eventDate = new Date(event.date + "T00:00");
        return eventDate >= today;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date + "T00:00");
        const bDate = new Date(b.date + "T00:00");
        return aDate < bDate ? -1 : 1;
      });

    this.isInitialized = true;
  }

  async deleteEvent(eventId: string) {
    const eventDocRef = doc(db, "events", eventId);
    try {
      await deleteDoc(eventDocRef);
      appState.setSnackbarMessage("Event deleted.");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }
}

const eventsState = new Events();
export default eventsState;
