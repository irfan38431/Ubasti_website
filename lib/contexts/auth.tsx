"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthUser {
  id: string;
  displayName: string | null;
  isAdmin: boolean;
  phoneE164: string | null;
  email: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAdmin: false,
  refetch: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn:  fetchMe,
    staleTime: 60_000,
    retry:     false,
  });

  return (
    <AuthContext.Provider
      value={{
        user:      data ?? null,
        isLoading,
        isAdmin:   data?.isAdmin ?? false,
        refetch:   () => qc.invalidateQueries({ queryKey: ["auth-me"] }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
