import { Metadata } from "next";
import EventDetail from "./EventDetail";

export const metadata: Metadata = {
  title: "Event Detail | Willemijn's World Website"
};

const EventDetailPage = () => {
  return <EventDetail />;
};

export default EventDetailPage;
