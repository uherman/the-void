"use client";

import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/lib/user-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
