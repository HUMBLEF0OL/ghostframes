import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainHeader } from "../lib/demo-components";
import { ThemeProvider } from "../lib/theme-context";
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
  title: "SkelCore Demo & Reference",
  description: "Zero-config skeleton loaders for React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <MainHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
