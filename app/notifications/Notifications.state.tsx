import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import myProfileState from "../profile/MyProfile.state";

class Notification {
  id: string;
  read: boolean;
  title: string;
  body: string | null = null;

  constructor(notification: DocumentData) {
    makeAutoObservable(this);
    this.read = notification.read;
    this.id = notification.id;
    this.title = notification.title;
    this.body = notification.body;
  }

  async markAsRead() {
    const userId = myProfileState.userId;
    if (!userId) return;

    try {
      const notifRef = doc(db, `users/${userId}/notifications`, this.id);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async markAsUnread() {
    const userId = myProfileState.userId;
    if (!userId) return;
    try {
      const notifRef = doc(db, `users/${userId}/notifications`, this.id);
      await updateDoc(notifRef, { read: false });
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  }

  toggleRead() {
    if (this.read) {
      this.markAsUnread();
    } else {
      this.markAsRead();
    }
  }
}

export class NotificationsState {
  notifications: Notification[] = [];
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
    this.notifications = notifications.map(
      (notification) => new Notification(notification)
    );
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
