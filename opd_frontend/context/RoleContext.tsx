"use client";

import { createContext, useContext } from "react";
import { AppRole } from "@/lib/rbac";

interface RoleContextValue {
  role: AppRole;
  username: string;
}

const RoleContext = createContext<RoleContextValue>({
  role: "User",
  username: "User",
});

export function RoleProvider({
  role,
  username,
  children,
}: {
  role: AppRole;
  username: string;
  children: React.ReactNode;
}) {
  return <RoleContext.Provider value={{ role, username }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
