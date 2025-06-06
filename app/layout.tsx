import type { Metadata } from "next";
import localFont from "next/font/local";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/QueryProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <Providers>
          <QueryProvider>
            <MaxWidthWrapper>
              <Navbar />
              {children}
            </MaxWidthWrapper>
          </QueryProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
