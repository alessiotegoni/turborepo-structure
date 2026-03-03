import { HydrateClient, prefetch, trpc } from "@beeto/api/web/server";
import { EventListScreen } from "@beeto/features/events/web";

export default function EventsPage() {
  prefetch(trpc.event.all.queryOptions());

  return (
    <HydrateClient>
      <EventListScreen />
    </HydrateClient>
  );
}
