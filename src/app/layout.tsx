// app/layout.tsx

import ClientSessionProvider from "@/components/ClientSessionProvider";
import Header from "@/components/Header";
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

export const metadata = {
  title: "My Task Manager",
  description:
    "Organize your tasks effortlessly with My Task Manager. Track, manage, and prioritize your to-do list with ease, staying on top of your goals and deadlines. Perfect for individuals and teams alike.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientSessionProvider>
          <div className="min-h-screen">
            <Header />
            <div className="h-[calc(100vh-72px)]">{children}</div>
          </div>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
