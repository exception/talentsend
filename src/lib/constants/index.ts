export const APP_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://app.talentsend.com"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://app.${process.env.VERCEL_URL}`
    : "http://localhost:3000";

    export const APP_URL_SECURE =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? "https://app.talentsend.com"
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://app.${process.env.VERCEL_URL}`
      : "https://localhost:3000";

const NGROK_URL = process.env.NGROK_URL ?? "";
export const APP_URL_WITH_NGROK = NGROK_URL || APP_URL;

export const IS_ON_VERCEL = !!process.env.VERCEL_URL;