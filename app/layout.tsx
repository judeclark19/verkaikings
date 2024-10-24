import { Inter } from "next/font/google";
import LayoutProviders from "@/lib/LayoutProviders"; // client side stuff
import Navbar from "@/components/Navbar/Navbar";

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
        <LayoutProviders>
          <Navbar />
          <main
            style={{
              padding: "1rem",
              paddingBottom: "4rem"
            }}
          >
            {children}
          </main>
        </LayoutProviders>
      </body>
    </html>
  );
}
