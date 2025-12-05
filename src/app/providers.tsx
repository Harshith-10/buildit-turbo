"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";

export function Providers({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
