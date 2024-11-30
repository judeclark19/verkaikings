import Dashboard from "@/components/Dashboard/Dashboard";
import WelcomeMessage from "@/components/WelcomeMessage";
import { decodeToken } from "@/lib/serverUtils";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

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
      {decodedToken && <Dashboard />}
    </div>
  );
}
