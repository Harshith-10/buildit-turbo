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

export function FilterBar() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 500,
    shallow: false,
  });
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "latest",
    shallow: false,
  });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "all",
    shallow: false,
  });
  const [difficulty, setDifficulty] = useQueryState("difficulty", {
    defaultValue: "all",
    shallow: false,
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search exams..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value || null)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="expiry">Expiring Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
