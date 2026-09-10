"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Resolve initial theme from localStorage, then fallback to system preference.
    const storedTheme = localStorage.getItem("theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeTheme = storedTheme || (preferredDark ? "dark" : "light");
    setTheme(activeTheme);
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
  }, []);

  const toggleTheme = () => {
    // Persist user preference so theme survives page reloads.
    const updated = theme === "dark" ? "light" : "dark";
    setTheme(updated);
    localStorage.setItem("theme", updated);
    document.documentElement.classList.toggle("dark", updated === "dark");
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

