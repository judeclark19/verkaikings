import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
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
  url: string | null = null;
  createdAt: string | null = null;

  constructor(notification: DocumentData) {
    makeAutoObservable(this);
    this.read = notification.read;
    this.id = notification.id;
    this.title = notification.title;
    this.body = notification.body;
    this.url = notification.url;
    this.createdAt = notification.createdAt;
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

  async delete() {
    // console.log("Deleting notification:", this.id);
    const userId = myProfileState.userId;
    if (!userId) return;
    try {
      const notifRef = doc(db, `users/${userId}/notifications`, this.id);
      await deleteDoc(notifRef);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
}

export class NotificationsState {
  isInitialized = false;
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

    this.unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifications: DocumentData[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as DocumentData[];

        // console.log("Live Notifications:", notifications);

        this.setNotifications(notifications);
        this.updatePageTitle();
      }
    );
  }

  updatePageTitle() {
    const unreadCount = this.unreadNotifications.length;

    // Store the original document title
    let originalTitle = document.title;

    //  if title starts with a notification count (##) remove it
    if (originalTitle.startsWith("(")) {
      originalTitle = originalTitle.split(") ")[1];
    }

    // Update the page title dynamically
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
  }

  setNotifications(notifications: DocumentData[]) {
    this.notifications = notifications.map(
      (notification) => new Notification(notification)
    );

    this.isInitialized = true;
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

  get readNotifications() {
    return this.notifications.filter((notif) => notif.read);
  }

  getNotificationById(id: string) {
    return this.notifications.find((n: DocumentData) => n.id === id);
  }

  markAllAsRead() {
    this.notifications.forEach((notif) => {
      if (!notif.read) {
        notif.markAsRead();
      }
    });
  }

  deleteAll() {
    this.notifications.forEach((notif) => {
      notif.delete();
    });
  }
}

const notificationsState = new NotificationsState();
export default notificationsState;
