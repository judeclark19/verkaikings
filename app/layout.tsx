import { Inter } from "next/font/google";
import LayoutProviders from "@/lib/LayoutProviders"; // client side stuff
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { Metadata } from "next";
import { decodeToken } from "@/lib/serverUtils";

export const metadata: Metadata = {
  title: "Willemijn's World Website",
  icons: {
    icon: ["/favicon_v2.ico"],
    apple: ["/apple-touch-icon_v2.png"],
    shortcut: ["/apple-touch-icon_v2.png"]
  },
  manifest: "/site_v2.webmanifest"
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const decodedToken = decodeToken();
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {/* Google Maps API Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places,marker`}
          strategy="beforeInteractive"
        />
        <LayoutProviders
          isLoggedIn={!!decodedToken}
          userId={decodedToken?.user_id}
        >
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
