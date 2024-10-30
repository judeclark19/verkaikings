import { Inter } from "next/font/google";
import LayoutProviders from "@/lib/LayoutProviders"; // client side stuff
import Navbar from "@/components/Navbar";
import Script from "next/script"; // Import Script

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        {/* Google Maps API Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places`}
          strategy="beforeInteractive"
        />

        <LayoutProviders>
          <Navbar />
          <main
            style={{
              padding: "1rem",
              paddingBottom: "4rem",
              maxWidth: "1400px",
              margin: "auto"
            }}
          >
            {children}
          </main>
        </LayoutProviders>
      </body>
    </html>
  );
}
