import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasExpired(expire: number) {
  return Math.floor(new Date().getTime() / 1000) > expire;
}

export function hasExpiredWithinMargin(expire: number) {
  // margin on server side is ~20
  return Math.floor(new Date().getTime() / 1000) > (expire - 10);
}

export function getUTCSeconds() {
  return Math.floor(new Date().getTime() / 1000)
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function trimString(input: string, size: number): string {
  if (input.length > size) {
      return input.substring(0, size);
  } else {
      return input;
  }
}

export function formatUTCDateTime(utcTimestamp: string | null) {
  if (!utcTimestamp) {
    return [];
  }

  const utcDate = new Date(utcTimestamp);
  const utcTime = utcDate.getTime();

  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  const localTime = utcTime - timezoneOffset;
  const localDate = new Date(localTime);

  const dateFormatter = new Intl.DateTimeFormat("en-CA", { dateStyle: "long" });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const localDateStr = dateFormatter.format(localDate);
  const localTimeStr = timeFormatter.format(localDate);

  return [localDateStr, localTimeStr];
}

export function getUTCString(): string {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}