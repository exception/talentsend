import { type ClassValue, clsx } from "clsx";
import { type Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { APP_URL } from "./constants";
import { string } from "zod";
import { env } from "@/env.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetadataProps {
  title?: string;
  description?: string;
}

export const makeMetadata = ({
  title = "Talentsend",
  description = "Talentsend",
}: MetadataProps = {}): Metadata => {
  return {
    title,
    metadataBase: new URL(APP_URL),
    icons: "/favicon.ico",
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
};

export const firstName = (fullName: string) => {
  if (!fullName) {
    return "";
  }

  return fullName.split(" ")[0];
};

export const isMultiDArrayEmpty = (array: any[][]) => {
  return array.length === 0 || array.every((arr) => arr.length === 0);
};

export type Guarantee<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export const nFormatter = (
  num?: number,
  opts: { digits?: number; full?: boolean } = {
    digits: 1,
  },
)  => {
  if (!num) return "0";
  if (opts.full) {
    return Intl.NumberFormat("en-US").format(num);
  }
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "m" },
    { value: 1e9, symbol: "g" },
    { value: 1e12, symbol: "t" },
    { value: 1e15, symbol: "p" },
    { value: 1e18, symbol: "e" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(opts.digits).replace(rx, "$1") + item.symbol
    : "0";
}

export const getLastDayOfMonth = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0); // This will give the last day of the current month
  return lastDay.getDate();
};

// Adjust the billingCycleStart based on the number of days in the current month
export const getAdjustedBillingCycleStart = (billingCycleStart: number) => {
  const lastDay = getLastDayOfMonth();
  if (billingCycleStart > lastDay) {
    return lastDay;
  } else {
    return billingCycleStart;
  }
};

export const log = async({ message, mention = false }: { message: string; mention?: boolean }) => {
  const hook = env.DISCORD_WEBHOOK_URL;
  if (env.NODE_ENV === "development") {
    console.log(message);
  }

  if (!hook) return;
  try {
    return await fetch(hook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `${mention ? "<@128286074769375232> " : ""}${message}`
      })
    })
  } catch (e) {
    console.log(`Failed to log to Talentsend Discord. Error ${e}`);
  }
}