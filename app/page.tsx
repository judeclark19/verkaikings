import WelcomeMessage from "@/components/WelcomeMessage";
import { decodeToken, readTokenFromCookie } from "@/lib/readTokenFromCookie";
import { Typography } from "@mui/material";
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
  const token = readTokenFromCookie();
  const decodedToken = decodeToken();

  return (
    <div>
      <Typography variant="h1">Verkaikings</Typography>
      <Typography variant="h2">Willemijn Verkaik fan club</Typography>
      <WelcomeMessage
        isLoggedIn={!!token}
        email={decodedToken ? decodedToken.email : null}
      />
    </div>
  );
}
