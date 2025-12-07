import Dashboard from "@/components/Dashboard/Dashboard";
import WelcomeMessage from "@/components/WelcomeMessage";
import { decodeToken } from "@/lib/serverUtils";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default async function Home() {
  const decodedToken = await decodeToken();

  return (
    <div style={{ textAlign: "center" }}>
      <Box
        sx={{
          margin: "2rem auto 0 auto",
          width: { xs: "220px", sm: "300px" },
          height: { xs: "220px", sm: "300px" },
          overflow: "hidden",
          borderRadius: "50%",
          position: "relative"
        }}
      >
        <Image
          src="/images/willemijn-hamburg-blue.jpg"
          alt="Willemijn Verkaik"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 150px, 220px"
          priority
        />
      </Box>
      <Typography variant="h1">Verkaikings Society</Typography>
      <Typography variant="h2">Willemijn&apos;s World Website</Typography>
      <WelcomeMessage
        isLoggedIn={!!decodedToken}
        email={decodedToken ? decodedToken.email : null}
      />
      {decodedToken && <Dashboard />}
    </div>
  );
}
