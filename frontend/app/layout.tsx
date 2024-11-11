import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/SocketProvider";
import { UserProvider } from "@/context/UserProvider";

const poppins = Poppins({ subsets: ["latin-ext"], weight: "500" });

export const metadata: Metadata = {
  title: "socialciac",
  description: "A web excel application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <UserProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </UserProvider>
      </body>
    </html>
  );
}
