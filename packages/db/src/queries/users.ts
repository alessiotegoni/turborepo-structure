import { eq } from "drizzle-orm";

import { db } from "../client";
import { users } from "../schema/users";

export function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export function createUser(data: typeof users.$inferInsert) {
  return db.insert(users).values(data);
}
