import type { Metadata } from "next";
import Background from "@components/ui/Background";
import "./globals.css";
import Navbar from "@components/ui/Navbar";
import { ErrorProvider } from "@components/providers/ErrorContext";
import { LoadingProvider } from "@components/providers/LoadingContext";
import LoadingManager from "@components/utils/LoadingManager";

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
        <LoadingProvider>
          <LoadingManager />
          <ErrorProvider>
            <Navbar />
            {children}
          </ErrorProvider>
        </LoadingProvider>

      </body>
    </html>
  );
}

export default RootLayout;