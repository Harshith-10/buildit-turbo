"use client";

import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionsFilterBarProps {
  hiddenFilters?: ("type" | "privacy")[];
}

export function CollectionsFilterBar({
  hiddenFilters = [],
}: CollectionsFilterBarProps) {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 500,
    shallow: false,
  });
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "latest",
    shallow: false,
  });
  const [type, setType] = useQueryState("type", {
    defaultValue: "all",
    shallow: false,
  });
  const [privacy, setPrivacy] = useQueryState("privacy", {
    defaultValue: "all",
    shallow: false,
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search collections..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value || null)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {!hiddenFilters.includes("type") && (
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="practice_sheet">Practice Sheets</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
        )}

        {!hiddenFilters.includes("privacy") && (
          <Select value={privacy} onValueChange={setPrivacy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most_questions">Most Questions</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
