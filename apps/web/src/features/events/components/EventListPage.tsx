"use client";

import { useUser } from "@beeto/auth/web/providers";
import { useEventList } from "@beeto/features/events/web/hooks";
import { Button, Input } from "@beeto/ui/web";

export function EventListPage() {
  const { user } = useUser();
  const {
    events,
    title,
    setTitle,
    description,
    setDescription,
    createEvent,
    deleteEvent,
  } = useEventList();

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Events</h1>

      {user && (
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            variant="primary"
            isPending={createEvent.isPending}
            onPress={() =>
              createEvent.mutate({ title, description, createdBy: user.id })
            }
          >
            Create
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {events?.map((e) => (
          <div
            key={e.id}
            className="bg-content flex items-center justify-between rounded-lg p-4 shadow-sm"
          >
            <div>
              <h2 className="text-xl font-bold">{e.title}</h2>
              <p className="text-sm">{e.description}</p>
            </div>
            <Button variant="danger" onPress={() => deleteEvent.mutate(e.id)}>
              Delete
            </Button>
          </div>
        ))}
        {events?.length === 0 && <p>No events found</p>}
      </div>
    </div>
  );
}
