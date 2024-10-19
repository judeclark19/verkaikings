import NewsFeed from "@/components/NewsFeed";
import WelcomeMessage from "@/components/WelcomeMessage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verkaikings",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"]
  }
};

export default function Home() {
  return (
    <div>
      <h1>Verkaikings</h1>
      <h2>Willemijn Verkaik fan club</h2>
      {/* <NewsFeed /> */}
      <WelcomeMessage />
    </div>
  );
}
