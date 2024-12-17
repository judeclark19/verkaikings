import { Metadata } from "next";
import NotificationsList from "./NotificationsList";

export const metadata: Metadata = {
  title: "Notifications | Willemijn's World Website"
};

function NotificationsPage() {
  return <NotificationsList />;
}

export default NotificationsPage;
