import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TRPCReactProvider } from "@beeto/api/web/react";
import { UserProvider } from "@beeto/auth/web";
import { cn } from "@beeto/ui";
import { ToastProvider } from "@beeto/ui/web";

import { env } from "~/env";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://beeto.com"
      : "http://localhost:3000",
  ),
  title: "Beeto",
  description: "An event management application",
  openGraph: {
    title: "Beeto",
    description: "An event management application",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Beeto",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ToastProvider />
        <TRPCReactProvider>
          <UserProvider>{props.children}</UserProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
