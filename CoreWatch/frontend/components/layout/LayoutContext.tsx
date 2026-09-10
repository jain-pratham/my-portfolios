"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LayoutContextType {
  title: string;
  setTitle: (title: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Map route pathnames to default page titles (modify these for your project paths)
  const defaultTitle = React.useMemo(() => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/profile")) return "Profile";
    if (pathname.startsWith("/settings")) return "Settings";
    return "CRM";
  }, [pathname]);

  const title = customTitle || defaultTitle;

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle: setCustomTitle,
        collapsed,
        setCollapsed,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
