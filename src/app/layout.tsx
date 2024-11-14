import type { Metadata } from "next";
import Background from "@components/ui/Background";
import "./globals.css";
import Navbar from "@components/ui/Navbar";
import { ErrorProvider } from "@components/providers/ErrorContext";

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
        <ErrorProvider>
          {children}=
        </ErrorProvider>
      </body>
    </html>
  );
}

export default RootLayout;