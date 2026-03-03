import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";

type User = { id: string; email?: string } | null;

const UserContext = createContext<{
  user: User | undefined;
  isLoading: boolean;
}>({ user: undefined, isLoading: true });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery(trpc.auth.getUser.queryOptions());

  return (
    <UserContext.Provider value={{ user: user as User, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
