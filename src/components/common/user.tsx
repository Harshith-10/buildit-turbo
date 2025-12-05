"use client";

import {
  ChevronsUpDown,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Slide } from "@/components/animate-ui/primitives/effects/slide";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";

export default function User({ size }: { size: "default" | "small" }) {
  const { data: session, isPending, error } = useSession();

  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    signOut();
  };

  if (isPending || !session?.user) {
    return <UserSkeleton size={size} />;
  }

  if (error) {
    toast.error("Failed to load session. Redirecting to login...");
    redirect("/auth/login");
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          {size === "default" ? (
            <div className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-accent transition-colors">
              <Avatar className="h-10 w-10 z-50">
                <AvatarImage src={user.image || "/null"} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-500 uppercase">
                  {user.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Fade delay={100} className="flex-1">
                <Slide
                  direction="right"
                  className="flex-1 flex items-center gap-2"
                >
                  <div className="flex-1 flex flex-col overflow-hidden text-left">
                    <p className="font-medium truncate text-sm">{user.name}</p>
                    <p className="text-muted-foreground text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </Slide>
              </Fade>
            </div>
          ) : (
            <Tooltip side="right">
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user.image || "/nulllder.svg"} />
                  <AvatarFallback className="bg-emerald-500/20 text-emerald-500 rounded h-full w-full uppercase text-xs">
                    {user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || "/nulllder.svg"} />
            <AvatarFallback className="bg-emerald-500/20 text-emerald-500 uppercase">
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden text-left">
            <p className="font-medium truncate text-sm">{user.name}</p>
            <p className="text-muted-foreground text-xs truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/settings" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="ml-2">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="ml-2">Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="ml-2">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserSkeleton({ size }: { size: "default" | "small" }) {
  return (
    <div className="cursor-pointer">
      {size === "default" ? (
        <div className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10 z-50">
            <Skeleton className="h-10 w-10" />
          </Avatar>
          <Fade delay={100} className="flex-1">
            <Slide direction="right" className="flex-1 flex items-center gap-2">
              <div className="flex-1 flex flex-col overflow-hidden text-left">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <ChevronsUpDown size={16} className="text-muted-foreground" />
            </Slide>
          </Fade>
        </div>
      ) : (
        <Tooltip side="right">
          <TooltipTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <Skeleton className="h-8 w-8" />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
