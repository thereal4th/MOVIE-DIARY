import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filmoire | Fourth and Sheena's Movie Journal",
  description: "Fourth and Sheena's personal interactive 2-page open cinema journal and movie diary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full max-h-screen overflow-hidden antialiased`}
    >
      <body className="h-full max-h-screen overflow-hidden flex flex-col m-0 p-0">{children}</body>
    </html>
  );
}
