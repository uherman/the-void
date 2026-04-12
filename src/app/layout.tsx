import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { UserSetup } from "@/components/user-setup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thoughts",
  description: "Share your thoughts with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-page text-gray-800 dark:text-gray-100 antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <UserSetup />
        </Providers>
      </body>
    </html>
  );
}
