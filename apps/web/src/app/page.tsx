
import { HydrateClient, prefetch, trpc } from "@beeto/api/web/server";
import { Link } from "@beeto/ui/web";

export default function HomePage() {
  prefetch(trpc.post.all.queryOptions());

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>

          <Link href="/events">Vedi eventi</Link>
        </div>
      </main>
    </HydrateClient>
  );
}
