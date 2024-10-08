import type { Metadata } from "next";
import Background from "@components/ui/Background";
import "./globals.css";

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
        <Background image={"bridge"} />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;