import { desc, eq } from "drizzle-orm";

import { db } from "../client";
import { events } from "../schema/events";

export function getEvents() {
  return db.query.events.findMany({
    orderBy: desc(events.id),
    limit: 10,
  });
}

export function getEventById(id: string) {
  return db.query.events.findFirst({
    where: eq(events.id, id),
  });
}

export function createEvent(data: typeof events.$inferInsert) {
  return db.insert(events).values(data);
}

export function deleteEvent(id: string) {
  return db.delete(events).where(eq(events.id, id));
}
