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


export const metadata = {
  title: "Infinity Events | Wedding Photography Bangalore",
  description:
    "Best wedding photography and cinematic videography services in Bangalore. Book your event now!",
  verification: {
    google: "d36MCASEu_f3KkTqFwKphl3YgRDd1Pum5mkXM_mOu5Q",
  },
  robots: {
  index: true,
  follow: true,
},
    keywords: [
    "Wedding Photography Bangalore",
    "Event Photography",
    "Cinematic Videography",
    "Infinity Events",
    "Event Planner Bangalore"
  ],
  authors: [{ name: "Infinity Events" }],
  openGraph: {
    title: "Infinity Events",
    description: "Premium photography and videography services",
    url: "https://infinity-events1.vercel.app/",
    siteName: "Infinity Events",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
