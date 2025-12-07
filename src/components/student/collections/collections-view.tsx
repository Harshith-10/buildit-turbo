"use client";

import { LayoutGrid, List } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { CollectionCard } from "@/components/student/collections/collection-card";

// import { CollectionTable } from "@/components/student/collections/collection-table"; // Assuming I might need this later, but for now I'll just use grid/list

interface Collection {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPrivate: boolean;
  type: "personal" | "practice_sheet" | "company";
  totalQuestions: number | null;
  updatedAt: Date;
  creatorId: string;
}

interface CollectionsViewProps {
  collections: Collection[];
  actionLabel: string;
  actionLinkPrefix?: string;
  defaultView?: "grid" | "list";
}

export function CollectionsView({
  collections,
  actionLabel,
  actionLinkPrefix,
  defaultView = "grid",
}: CollectionsViewProps) {
  const [view, setView] = useQueryState("view", {
    defaultValue: defaultView,
    parse: (v) => v as "grid" | "list",
  });

  const currentView = view === "grid" || view === "list" ? view : "grid";

  return (
    <Tabs
      value={currentView}
      onValueChange={(v) => setView(v as "grid" | "list")}
      className="w-full"
    >
      <div className="flex justify-end mb-4">
        <TabsList>
          <TabsTrigger value="grid" aria-label="Grid View">
            <LayoutGrid className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="list" aria-label="List View">
            <List className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContents>
        <TabsContent value="grid">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-lg font-medium">No collections found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or create a new one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  viewMode="grid"
                  actionLabel={actionLabel}
                  actionLink={
                    actionLinkPrefix
                      ? `${actionLinkPrefix}/${collection.slug}`
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="list">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-lg font-medium">No collections found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or create a new one.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  viewMode="list"
                  actionLabel={actionLabel}
                  actionLink={
                    actionLinkPrefix
                      ? `${actionLinkPrefix}/${collection.slug}`
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </TabsContents>
    </Tabs>
  );
}
