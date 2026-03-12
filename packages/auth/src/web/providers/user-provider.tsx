"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@beeto/api/web/react";

import type { UserContextType } from "../../types";

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();
  const { data: user, isLoading } = useQuery(trpc.auth.getUser.queryOptions());

  return (
    <UserContext.Provider value={{ user: user ?? null, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
