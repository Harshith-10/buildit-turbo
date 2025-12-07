import { Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/actions/student/collections";
import { DuplicateCollectionButton } from "@/components/student/collections/duplicate-collection-button";
import { ShareCollectionButton } from "@/components/student/collections/share-collection-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ secret?: string }>;
}

export default async function CollectionDetailsPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug } = params;
  const { secret } = searchParams;

  let collection: Awaited<ReturnType<typeof getCollectionBySlug>> | undefined;
  try {
    collection = await getCollectionBySlug(slug, secret);
  } catch (error) {
    // If unauthorized, it throws error
    console.error(error);
  }

  if (!collection) {
    notFound();
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {collection.title}
            </h1>
            {collection.isPrivate ? (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" /> Private
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Unlock className="h-3 w-3" /> Public
              </Badge>
            )}
            <Badge variant="outline">{collection.type}</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {collection.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <span>Created by {collection.creatorName || "Unknown"}</span>
            <span>•</span>
            <span>{collection.totalQuestions} problems</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {collection.isCreator ? (
            <ShareCollectionButton
              slug={collection.slug}
              shareSecret={collection.shareSecret}
              isPrivate={collection.isPrivate}
            />
          ) : (
            <DuplicateCollectionButton slug={collection.slug} secret={secret} />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
          <CardDescription>
            List of problems in this collection.
          </CardDescription>
        </CardHeader>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collection.problems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No problems in this collection yet.
                  </TableCell>
                </TableRow>
              ) : (
                collection.problems.map((problem, index) => (
                  <TableRow key={problem.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {problem.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          problem.difficulty === "easy"
                            ? "default" // Greenish usually
                            : problem.difficulty === "medium"
                              ? "secondary" // Yellowish
                              : "destructive" // Red
                        }
                        className={
                          problem.difficulty === "easy"
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : problem.difficulty === "medium"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-rose-500 hover:bg-rose-600"
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/student/problems/${problem.slug}`}>
                          Solve
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
