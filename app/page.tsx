import WelcomeMessage from "@/components/WelcomeMessage";
import { decodeToken, getTokenFromCookie } from "@/lib/serverUtils";
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
  const token = getTokenFromCookie();
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
