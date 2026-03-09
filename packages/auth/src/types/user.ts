import type { User as SupabaseUser } from "@supabase/supabase-js";

import { User as DBUser } from "@beeto/db/schema";

export type User = SupabaseUser & { db: DBUser };

export type UserContextType = {
  user: User | null;
  isLoading: boolean;
};
