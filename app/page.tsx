import WelcomeMessage from "@/components/WelcomeMessage";
import { decodeToken } from "@/lib/serverUtils";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Willemijn's World Website",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"]
  }
};

export default function Home() {
  const decodedToken = decodeToken();

  return (
    <div style={{ textAlign: "center" }}>
      <Box
        sx={{
          margin: "2rem auto 0 auto",
          width: { xs: "150px", sm: "220px" },
          height: { xs: "150px", sm: "220px" },
          overflow: "hidden",
          borderRadius: "50%",
          position: "relative"
        }}
      >
        <Image
          src="/images/willemijn-landing.jpg"
          alt="Willemijn Verkaik"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 150px, 220px"
          priority
        />
      </Box>
      <Typography variant="h1">Willemijn&apos;s World Website</Typography>
      <Typography variant="h2">Verkaikings Society</Typography>
      <WelcomeMessage
        isLoggedIn={!!decodedToken}
        email={decodedToken ? decodedToken.email : null}
      />
    </div>
  );
}
