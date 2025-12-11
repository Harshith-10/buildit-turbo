"use client";

// Type for rich text editor value (plate-style)
type Value = { type: string; children: { text: string }[] }[];

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  type CreateQuestionInput,
  createQuestion,
  type UpdateQuestionInput,
  updateQuestion,
} from "@/actions/faculty/questions";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFormProps {
  initialData?: Partial<CreateQuestionInput> & { id?: string };
  isEditing?: boolean;
}

export function QuestionForm({
  initialData,
  isEditing = false,
}: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    difficulty: initialData?.difficulty || "easy",
    category: initialData?.category || "development",
    description: initialData?.description || "",
    acceptance: initialData?.acceptance || 0,
    tags: initialData?.tags?.join(", ") || "",
  });

  const [editorValue, setEditorValue] = useState<Value>(
    initialData?.description
      ? JSON.parse(initialData.description)
      : [{ type: "p", children: [{ text: "" }] }],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        description: JSON.stringify(editorValue),
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        acceptance: Number(formData.acceptance),
        // Provide required fields with default values
        examples: [],
        constraints: [],
        starterCode: {},
        driverCode: {},
        testCases: [],
      };

      if (isEditing && initialData?.id) {
        await updateQuestion(initialData.id, payload as UpdateQuestionInput);
        toast.success("Question updated successfully");
      } else {
        await createQuestion(payload as CreateQuestionInput);
        toast.success("Question created successfully");
      }
      router.push("/faculty/questions/all-questions");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
                ? "Update Question"
                : "Create Question"}
          </Button>
        </div>
      </div>

      <div className="space-y-6 pb-10">
        <Fade delay={100}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the fundamental details of your question
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
                    placeholder="e.g., Two Sum Problem"
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
                    placeholder="e.g., two-sum"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(val) =>
                      handleSelectChange("difficulty", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => handleSelectChange("category", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="data-structures">
                        Data Structures
                      </SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="system-design">
                        System Design
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="arrays, hash-table, two-pointers"
                />
              </div>
            </CardContent>
          </Card>
        </Fade>

        <Fade delay={200}>
          <Card>
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
              <CardDescription>
                Provide a detailed description of the problem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                initialValue={editorValue}
                onChange={setEditorValue}
              />
            </CardContent>
          </Card>
        </Fade>
      </div>
    </form>
  );
}
