"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@beeto/api/web/react";
import { User } from "@beeto/db/schema";

const UserContext = createContext<{
  user: (SupabaseUser & { db: User }) | null;
  isLoading: boolean;
}>({ user: null, isLoading: true });

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
