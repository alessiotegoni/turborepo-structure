import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";

import { UserContextType } from "../../types";

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery(trpc.auth.getUser.queryOptions());

  return (
    <UserContext.Provider value={{ user: user ?? null, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
