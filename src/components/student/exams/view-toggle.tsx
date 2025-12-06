"use client";

import { LayoutGrid, List, Table as TableIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";

export function ViewToggle() {
  const [view, setView] = useQueryState("view", { defaultValue: "grid" });

  return (
    <Tabs value={view} onValueChange={(v) => setView(v)} className="w-auto">
      <TabsList>
        <TabsTrigger value="grid" aria-label="Grid View">
          <LayoutGrid className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="list" aria-label="List View">
          <List className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="table" aria-label="Table View">
          <TableIcon className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
