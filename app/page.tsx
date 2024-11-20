import WelcomeMessage from "@/components/WelcomeMessage";
import { decodeToken, getTokenFromCookie } from "@/lib/serverUtils";
import { Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Willemijn's World Website",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"]
  }
};

export default function Home() {
  const token = getTokenFromCookie();
  const decodedToken = decodeToken();

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h1">Willemijn&apos;s World Website</Typography>
      <Typography variant="h2">Verkaikings Society</Typography>
      <WelcomeMessage
        isLoggedIn={!!token}
        email={decodedToken ? decodedToken.email : null}
      />
    </div>
  );
}
