import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const calSans = localFont({
  src: '../assets/fonts/CalSans-SemiBold.otf',
  variable: '--font-cal-sans',
});