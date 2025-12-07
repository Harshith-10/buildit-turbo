"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn } from "@/lib/auth-client";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your credentials below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email / Roll Number / Faculty ID</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              const isEmail = email.includes("@");
              const fetchOptions = {
                onRequest: () => {
                  setLoading(true);
                },
                onResponse: () => {
                  setLoading(false);
                },
                onSuccess: async (ctx: {
                  data?: { user?: { role?: string } };
                }) => {
                  let role = ctx.data?.user?.role;
                  console.log("User role from response:", role); // Debugging

                  if (!role) {
                    console.log("Role missing, fetching session...");
                    const session = await getSession();
                    role = session?.data?.user?.role ?? undefined;
                    console.log("User role from session:", role);
                  }

                  if (role === "admin") {
                    router.push("/admin/dashboard");
                  } else if (role === "faculty") {
                    router.push("/faculty/dashboard");
                  } else {
                    router.push("/student/dashboard");
                  }
                },
                onError: (ctx: { error: { message: string } }) => {
                  toast.error(ctx.error.message);
                },
              };

              if (isEmail) {
                await signIn.email(
                  {
                    email,
                    password,
                  },
                  fetchOptions,
                );
              } else {
                await signIn.username(
                  {
                    username: email,
                    password,
                  },
                  fetchOptions,
                );
              }
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p> Login </p>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
