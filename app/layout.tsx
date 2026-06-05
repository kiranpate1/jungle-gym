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
  metadataBase: new URL("https://bykiranpa.tel/"),
  title: {
    default: "By Kiran Patel",
    template: "%s | By Kiran Patel",
  },
  description: "Prototypes designed and built by Kiran Patel",
  applicationName: "By Kiran Patel",
  keywords: ["keyword-1", "keyword-2", "keyword-3"],
  authors: [{ name: "Kiran Patel" }],
  creator: "Kiran Patel",
  publisher: "Kiran Patel",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "By Kiran Patel",
    title: "By Kiran Patel",
    description: "Prototypes designed and built by Kiran Patel",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "By Kiran Patel site preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "By Kiran Patel",
    description: "Prototypes designed and built by Kiran Patel",
    images: ["/og-image.jpg"],
    creator: "@pate1kiran",
  },
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
        {children}
      </body>
    </html>
  );
}
