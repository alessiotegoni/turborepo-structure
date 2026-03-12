import { eq } from "drizzle-orm";

import { db } from "../client";
import { profiles } from "../schema";

export function getProfileByEmail(email: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.email, email),
  });
}

export function createProfile(data: typeof profiles.$inferInsert) {
  return db.insert(profiles).values(data);
}
