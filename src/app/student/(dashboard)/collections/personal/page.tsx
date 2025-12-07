import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { headers } from "next/headers";
import { CollectionsFilterBar } from "@/components/student/collections/collections-filter-bar";
import { CollectionsView } from "@/components/student/collections/collections-view";
import { CreateCollectionDialog } from "@/components/student/collections/create-collection-dialog";
import { db } from "@/db";
import { collections } from "@/db/schema/collections";
import { auth } from "@/lib/auth";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    view?: string;
    sort?: string;
    privacy?: string;
  }>;
}

export default async function YourCollectionsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const view = (searchParams.view as "grid" | "list") || "grid";
  const sort = searchParams.sort || "latest";
  const privacy = searchParams.privacy || "all";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Unauthorized</div>;
  }

  // Build where conditions
  const whereConditions = [];

  // Always filter by personal type
  whereConditions.push(eq(collections.type, "personal"));

  // Always filter by creator = me
  whereConditions.push(eq(collections.creatorId, session.user.id));

  if (privacy !== "all") {
    if (privacy === "private") {
      whereConditions.push(eq(collections.isPrivate, true));
    } else {
      whereConditions.push(eq(collections.isPrivate, false));
    }
  }

  if (q) {
    whereConditions.push(
      or(
        ilike(collections.title, `%${q}%`),
        ilike(collections.description, `%${q}%`),
      ) as SQL<unknown>,
    );
  }

  const finalWhere = and(...whereConditions);

  let orderBy = desc(collections.createdAt);
  switch (sort) {
    case "oldest":
      orderBy = asc(collections.createdAt);
      break;
    case "most_questions":
      orderBy = desc(collections.totalQuestions);
      break;
  }

  const collectionsData = await db.query.collections.findMany({
    where: finalWhere,
    orderBy: orderBy,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Your Collections
            </h1>
            <p className="text-muted-foreground">
              Manage your personal problem collections.
            </p>
          </div>
          <CreateCollectionDialog />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <CollectionsFilterBar hiddenFilters={["type"]} />
        </div>
      </div>

      <CollectionsView
        collections={collectionsData}
        actionLabel="View Details"
        actionLinkPrefix="/student/collections"
        defaultView={view}
      />
    </div>
  );
}
