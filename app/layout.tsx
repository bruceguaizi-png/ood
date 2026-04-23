import type { Metadata } from "next";

import { PostHogProvider } from "@/components/posthog-provider";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "O.O.D | Paid Beta",
  description:
    "O.O.D is a wellness-entertainment ritual app for premium manifest receipts, built as a paid beta.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "O.O.D | Paid Beta",
    description:
      "O.O.D is a wellness-entertainment ritual app for premium manifest receipts, built as a paid beta.",
    siteName: "O.O.D",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "O.O.D | Paid Beta",
    description:
      "O.O.D is a wellness-entertainment ritual app for premium manifest receipts, built as a paid beta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PostHogProvider />
        {children}
      </body>
    </html>
  );
}
