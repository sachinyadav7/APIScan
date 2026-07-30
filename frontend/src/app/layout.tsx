import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "APIScan — API Security Testing Platform",
  description:
    "Scan, test, and monitor your APIs for security vulnerabilities. Detect SQL injection, XSS, CORS misconfigurations, and more.",
  keywords: ["API security", "vulnerability scanner", "penetration testing", "OWASP"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-surface text-on-surface`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
