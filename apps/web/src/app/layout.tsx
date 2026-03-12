import "~/app/styles.css";

import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";

import { TRPCReactProvider } from "@beeto/api/web/react";
import { prefetch, trpc } from "@beeto/api/web/server";
import { UserProvider } from "@beeto/auth/web/providers";
import { cn } from "@beeto/ui";
import { ToastProvider } from "@beeto/ui/web";

import { env } from "~/env";

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

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});
// const geistMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-geist-mono",
// });

export default function RootLayout(props: { children: React.ReactNode }) {
  prefetch(trpc.auth.getUser.queryOptions());

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen antialiased",
          urbanist.className,
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
