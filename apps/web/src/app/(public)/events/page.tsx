import { HydrateClient, prefetch, trpc } from "@beeto/api/web/server";

import { EventListPage } from "~/features/events/components/EventListPage";

export default function EventsPage() {
  prefetch(trpc.event.all.queryOptions());

  return (
    <HydrateClient>
      <EventListPage />
    </HydrateClient>
  );
}
