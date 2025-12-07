"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  createCollection,
  updateCollection,
} from "@/actions/faculty/collections";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CollectionFormProps {
  initialData?: any;
  isEditing?: boolean;
  children?: React.ReactNode;
  selectedProblemIds?: string[];
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CollectionForm({
  initialData,
  isEditing = false,
  children,
  selectedProblemIds,
}: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    type: initialData?.type || "practice_sheet",
    isPublic: initialData?.isPublic ?? true,
    isPrivate: initialData?.isPrivate ?? false,
    topics: initialData?.topics?.join(", ") || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        topics: formData.topics
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        problemIds: selectedProblemIds,
      };

      if (isEditing) {
        await updateCollection(initialData.id, payload as any);
        toast.success("Collection updated successfully");
      } else {
        await createCollection(payload as any);
        toast.success("Collection created successfully");
      }
      router.push("/faculty/collections/all-collections");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 h-[calc(100vh-10rem)] flex flex-col"
    >
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Collection"
                    : "Create Collection"}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="details" className="h-full mt-0">
              <Fade delay={100} className="h-full">
                <Card className="h-full overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Collection Details</CardTitle>
                    <CardDescription>
                      Configure the basic information for your collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Dynamic Programming Essentials"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          placeholder="e.g., dp-essentials"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what this collection is about..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Collection Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(val) =>
                            handleSelectChange("type", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="practice_sheet">
                              Practice Sheet
                            </SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topics">Topics (comma separated)</Label>
                        <Input
                          id="topics"
                          name="topics"
                          value={formData.topics}
                          onChange={handleChange}
                          placeholder="arrays, dp, graphs"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Fade>
            </TabsContent>

            <TabsContent value="problems" className="h-full mt-0">
              <Fade delay={100} className="h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Problem Selection</CardTitle>
                    <CardDescription>
                      Choose problems to include in this collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <div className="h-full overflow-y-auto p-6 pt-0">
                      {children}
                    </div>
                  </CardContent>
                </Card>
              </Fade>
            </TabsContent>

            <TabsContent value="settings" className="h-full mt-0">
              <Fade delay={100} className="h-full">
                <Card className="h-full overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Visibility Settings</CardTitle>
                    <CardDescription>
                      Control who can see this collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPublic"
                          checked={formData.isPublic}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isPublic", checked)
                          }
                        />
                        <Label htmlFor="isPublic" className="cursor-pointer">
                          <div className="font-medium">Public</div>
                          <div className="text-xs text-muted-foreground">
                            Visible to all students
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPrivate"
                          checked={formData.isPrivate}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isPrivate", checked)
                          }
                        />
                        <Label htmlFor="isPrivate" className="cursor-pointer">
                          <div className="font-medium">Private</div>
                          <div className="text-xs text-muted-foreground">
                            Only you can access
                          </div>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Fade>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </form>
  );
}
