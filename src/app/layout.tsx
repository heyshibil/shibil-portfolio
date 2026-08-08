import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shibil Mohammed | Full-stack Developer",
  description: "Shibil Mohammed is a full-stack developer from Kerala, India, building dependable web applications and backend systems.",
  openGraph: {
    title: "Shibil Mohammed | Full-stack Developer",
    description: "I build products from the problem up.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#101412", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
