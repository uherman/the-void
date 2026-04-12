"use client";

import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/lib/user-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
