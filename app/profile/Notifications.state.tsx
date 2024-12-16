import { db } from "@/lib/firebase";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { makeAutoObservable } from "mobx";

export class NotificationsState {
  notifications: DocumentData[] = [];
  unsubscribeNotifications: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  subscribeToNotifications(userId: string) {
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    const notificationsQuery = query(
      notificationsRef,
      orderBy("createdAt", "desc")
    );

    // Store the original document title
    const originalTitle = document.title;

    // Set up Firestore subscription
    this.unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifications: DocumentData[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as DocumentData[]; // Type assertion to treat data as Notification[]

        console.log("Live Notifications:", notifications);

        // Store notifications in state
        this.setNotifications(notifications);

        // Count unread notifications
        const unreadCount = notifications.filter((n) => !n.read).length;

        // Update the page title dynamically
        if (unreadCount > 0) {
          document.title = `(${unreadCount}) ${originalTitle}`;
        } else {
          document.title = originalTitle;
        }
      }
    );
  }

  setNotifications(notifications: DocumentData[]) {
    this.notifications = notifications;
  }

  unsubscribeFromNotifications() {
    if (this.unsubscribeNotifications) {
      this.unsubscribeNotifications();
      this.unsubscribeNotifications = null;
    }
  }

  get unreadNotifications() {
    return this.notifications.filter((notif) => !notif.read);
  }
}

const notificationsState = new NotificationsState();
export default notificationsState;
