"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { getCollections } from "@/actions/faculty/collections";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  title: string;
  totalQuestions: number | null;
}

interface CollectionsSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function CollectionsSelector({
  selectedIds,
  onSelectionChange,
}: CollectionsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const result = await getCollections(1, 50, debouncedSearch);
        setCollections(result.data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [debouncedSearch]);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const _selectedCollections = collections.filter((c) =>
    selectedIds.includes(c.id),
  );

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedIds.length > 0
              ? `${selectedIds.length} collections selected`
              : "Select collections..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search collections..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              )}
              {!loading && collections.length === 0 && (
                <CommandEmpty>No collections found.</CommandEmpty>
              )}
              <CommandGroup>
                {collections.map((collection) => (
                  <CommandItem
                    key={collection.id}
                    value={collection.id}
                    onSelect={() => toggleSelection(collection.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(collection.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{collection.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {collection.totalQuestions || 0} questions
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIds.length > 0 && (
        <ScrollArea className="h-[200px] border rounded-md p-4">
          <div className="space-y-2">
            {selectedIds.map((id) => {
              const collection = collections.find((c) => c.id === id);
              if (!collection) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-2 border rounded-md bg-muted/20"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {collection.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {collection.totalQuestions || 0} questions
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSelection(id)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
