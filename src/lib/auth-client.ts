import "dotenv/config";
import { createAuthClient } from "better-auth/react";

export const { signIn, useSession, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
});
