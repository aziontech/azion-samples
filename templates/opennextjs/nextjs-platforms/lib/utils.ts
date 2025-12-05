import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
export const protocol =
  process.env.NODE_ENV === "production" && !rootDomain.includes("localhost")
    ? "https"
    : "http";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
