import { db } from "@/lib/firebase";
import { DocumentData } from "firebase-admin/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

export type EventType = {
  id: string;
  creatorId: string;
  createdAt: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  locationUrl: string;
  description: string;
  attendees: any[];
};

export class Events {
  isInitialized = false;
  allEvents: DocumentData[] = [];
  pastEvents: DocumentData[] = [];
  upcomingEvents: DocumentData[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  setAllEvents(events: DocumentData[]) {
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
      await deleteDoc(eventDocRef); // Use deleteDoc to delete the document
      console.log("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }
}

const eventsState = new Events();
export default eventsState;
