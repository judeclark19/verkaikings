import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Willemijn Verkaik Fan Club",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"]
  }
};

export default function Home() {
  return (
    <div
      style={{
        padding: "20px"
      }}
    >
      <h1>WV Fan Club</h1>
    </div>
  );
}
