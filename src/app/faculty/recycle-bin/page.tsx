import { getDeletedCollections } from "@/actions/faculty/collections";
import { getDeletedExams } from "@/actions/faculty/exams";
import { getDeletedQuestions } from "@/actions/faculty/questions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecycleBinList } from "@/components/faculty/recycle-bin/recycle-bin-list";

export default async function RecycleBinPage() {
  const [questions, collections, exams] = await Promise.all([
    getDeletedQuestions(1, 50), // Fetch first 50 for now
    getDeletedCollections(1, 50),
    getDeletedExams(1, 50),
  ]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Recycle Bin</h1>
        <p className="text-muted-foreground">
          View and restore deleted items. Items are permanently removed after 30
          days.
        </p>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="questions">
            Questions ({questions.total})
          </TabsTrigger>
          <TabsTrigger value="collections">
            Collections ({collections.total})
          </TabsTrigger>
          <TabsTrigger value="exams">Exams ({exams.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deleted Questions</CardTitle>
              <CardDescription>
                Manage your deleted questions here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecycleBinList items={questions.data} type="question" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deleted Collections</CardTitle>
              <CardDescription>
                Manage your deleted collections here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecycleBinList items={collections.data} type="collection" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deleted Exams</CardTitle>
              <CardDescription>Manage your deleted exams here.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecycleBinList items={exams.data} type="exam" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
