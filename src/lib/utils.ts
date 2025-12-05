import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User } from "@/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getMe(): Promise<User> {
  return axios.get("/api/me").then((res) => res.data);
}

export async function getMeFast(): Promise<User> {
  return axios.get("/api/me/fast").then((res) => res.data);
}
