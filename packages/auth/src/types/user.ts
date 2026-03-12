import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as DBUser } from "@beeto/db/schema";

export type User = SupabaseUser & { db: DBUser };

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
}
