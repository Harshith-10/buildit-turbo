"use client";

import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";

export default function ThemeToggle() {
  return <ThemeTogglerButton modes={["dark", "light"]} />;
}
