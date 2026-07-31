import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AcademiaFlow | Student Grade & Productivity Platform",
  description: "Comprehensive, responsive academic record tracking and student productivity web application. Calculate School, UG, PG, Ph.D. marks locally.",
  keywords: ["AcademiaFlow", "Academic Tracker", "GPA Calculator", "CGPA Calculator", "Student Productivity", "Study Revision Checklist"],
  authors: [{ name: "AcademiaFlow Team" }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "AcademiaFlow | Student Grade & Productivity Platform",
    description: "Master your academic journey with offline-first tracking for school, college, and PhD.",
    url: "https://academiaflow.com",
    siteName: "AcademiaFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AcademiaFlow Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AcademiaFlow | Student Grade & Productivity Platform",
    description: "Master your academic journey with offline-first tracking for school, college, and PhD.",
    images: ["/og-image.png"],
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable}`}>

      </body>
    </html>
  );
}
