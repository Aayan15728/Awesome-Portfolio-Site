"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const THEME_COLORS = { light: "#FCFCFC", dark: "#0A0A0A" } as const;

/** Keeps <meta name="theme-color"> (mobile browser bars, PWA title bar) matching the active theme. */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const color = resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [resolvedTheme]);

  return null;
}
