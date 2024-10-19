import type { Metadata } from "next";
import Background from "@components/ui/Background";
import "./globals.css";
import Navbar from "@components/ui/Navbar";

export const metadata: Metadata = {
  title: "Mythoi Stratgos",
  description: "Mythoi Stratgos Demo",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Navbar />
        <Background image={"bridge"} />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;