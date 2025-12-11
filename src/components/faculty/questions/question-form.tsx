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

  // Examples state
  const [examples, setExamples] = useState<{ input: string; output: string; explanation?: string }[]>(
    initialData?.examples || [{ input: "", output: "", explanation: "" }]
  );

  // Constraints state
  const [constraints, setConstraints] = useState<string[]>(
    initialData?.constraints || [""]
  );

  // Test cases state (up to 5 visible + 5 hidden = 10 total)
  const [testCases, setTestCases] = useState<{ id: number; input: string; expected: string; hidden: boolean }[]>(
    initialData?.testCases?.map(tc => ({ ...tc, hidden: tc.hidden ?? false })) || [{ id: 1, input: "", expected: "", hidden: false }]
  );

  // Starter code state
  const [starterCode, setStarterCode] = useState<Record<string, string>>(
    initialData?.starterCode || { java: "", python: "", javascript: "" }
  );

  // Driver code state
  const [driverCode, setDriverCode] = useState<Record<string, string>>(
    initialData?.driverCode || { java: "", python: "", javascript: "" }
  );

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
      // Validation
      const visibleTestCases = testCases.filter(tc => !tc.hidden && tc.input && tc.expected);
      const hiddenTestCases = testCases.filter(tc => tc.hidden && tc.input && tc.expected);

      if (visibleTestCases.length === 0) {
        toast.error("At least 1 visible test case is required");
        setLoading(false);
        return;
      }

      if (visibleTestCases.length > 5) {
        toast.error("Maximum 5 visible test cases allowed");
        setLoading(false);
        return;
      }

      if (hiddenTestCases.length > 5) {
        toast.error("Maximum 5 hidden test cases allowed");
        setLoading(false);
        return;
      }

      // Filter and format data
      const validExamples = examples.filter(ex => ex.input && ex.output);
      const validConstraints = constraints.filter(c => c.trim());
      const validTestCases = testCases
        .filter(tc => tc.input && tc.expected)
        .map((tc, index) => ({
          id: index + 1,
          input: tc.input.trim(),
          expected: tc.expected.trim(),
          hidden: tc.hidden
        }));

      const payload = {
        ...formData,
        description: JSON.stringify(editorValue),
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        acceptance: Number(formData.acceptance),
        examples: validExamples,
        constraints: validConstraints,
        starterCode,
        driverCode,
        testCases: validTestCases,
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

        <Fade delay={300}>
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
              <CardDescription>
                Add example inputs and outputs to help students understand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-semibold">Example {index + 1}</Label>
                    {examples.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExamples(examples.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Input</Label>
                    <Input
                      placeholder="e.g., nums = [2,7,11,15], target = 9"
                      value={example.input}
                      onChange={(e) => {
                        const newExamples = [...examples];
                        newExamples[index].input = e.target.value;
                        setExamples(newExamples);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Output</Label>
                    <Input
                      placeholder="e.g., [0,1]"
                      value={example.output}
                      onChange={(e) => {
                        const newExamples = [...examples];
                        newExamples[index].output = e.target.value;
                        setExamples(newExamples);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <Input
                      placeholder="e.g., Because nums[0] + nums[1] == 9"
                      value={example.explanation || ""}
                      onChange={(e) => {
                        const newExamples = [...examples];
                        newExamples[index].explanation = e.target.value;
                        setExamples(newExamples);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setExamples([...examples, { input: "", output: "", explanation: "" }])}
              >
                Add Example
              </Button>
            </CardContent>
          </Card>
        </Fade>

        <Fade delay={400}>
          <Card>
            <CardHeader>
              <CardTitle>Constraints</CardTitle>
              <CardDescription>
                Define the constraints for the problem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {constraints.map((constraint, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g., 1 <= nums.length <= 10^4"
                    value={constraint}
                    onChange={(e) => {
                      const newConstraints = [...constraints];
                      newConstraints[index] = e.target.value;
                      setConstraints(newConstraints);
                    }}
                  />
                  {constraints.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setConstraints(constraints.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setConstraints([...constraints, ""])}
              >
                Add Constraint
              </Button>
            </CardContent>
          </Card>
        </Fade>

        <Fade delay={500}>
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
              <CardDescription>
                Add test cases (max 5 visible + 5 hidden = 10 total)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {testCases.map((testCase, index) => {
                  const visibleCount = testCases.filter((tc, i) => i <= index && !tc.hidden).length;
                  const hiddenCount = testCases.filter((tc, i) => i <= index && tc.hidden).length;
                  const canToggleToVisible = testCase.hidden || visibleCount < 5;
                  const canToggleToHidden = !testCase.hidden || hiddenCount < 5;

                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Label className="font-semibold">Test Case {index + 1}</Label>
                          <span className={`text-xs px-2 py-1 rounded ${
                            testCase.hidden 
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}>
                            {testCase.hidden ? "Hidden" : "Visible"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newTestCases = [...testCases];
                              newTestCases[index].hidden = !newTestCases[index].hidden;
                              setTestCases(newTestCases);
                            }}
                            disabled={testCase.hidden ? !canToggleToVisible : !canToggleToHidden}
                          >
                            {testCase.hidden ? "Make Visible" : "Make Hidden"}
                          </Button>
                          {testCases.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setTestCases(testCases.filter((_, i) => i !== index))}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Input</Label>
                          <Input
                            placeholder="e.g., [2,7,11,15], 9"
                            value={testCase.input}
                            onChange={(e) => {
                              const newTestCases = [...testCases];
                              newTestCases[index].input = e.target.value;
                              setTestCases(newTestCases);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expected Output</Label>
                          <Input
                            placeholder="e.g., [0,1]"
                            value={testCase.expected}
                            onChange={(e) => {
                              const newTestCases = [...testCases];
                              newTestCases[index].expected = e.target.value;
                              setTestCases(newTestCases);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const visibleCount = testCases.filter(tc => !tc.hidden).length;
                    if (visibleCount >= 5) {
                      toast.error("Maximum 5 visible test cases allowed");
                      return;
                    }
                    setTestCases([...testCases, { id: testCases.length + 1, input: "", expected: "", hidden: false }]);
                  }}
                  disabled={testCases.filter(tc => !tc.hidden).length >= 5}
                >
                  Add Visible Test Case ({testCases.filter(tc => !tc.hidden).length}/5)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const hiddenCount = testCases.filter(tc => tc.hidden).length;
                    if (hiddenCount >= 5) {
                      toast.error("Maximum 5 hidden test cases allowed");
                      return;
                    }
                    setTestCases([...testCases, { id: testCases.length + 1, input: "", expected: "", hidden: true }]);
                  }}
                  disabled={testCases.filter(tc => tc.hidden).length >= 5}
                >
                  Add Hidden Test Case ({testCases.filter(tc => tc.hidden).length}/5)
                </Button>
              </div>
              
              {/* Preview section */}
              {testCases.filter(tc => !tc.hidden && tc.input && tc.expected).length > 0 && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <Label className="text-sm font-semibold mb-3 block">📋 Student View Preview (Visible Test Cases Only):</Label>
                  <div className="space-y-2">
                    {testCases
                      .filter(tc => !tc.hidden && tc.input && tc.expected)
                      .map((tc, index) => (
                        <div key={index} className="bg-background p-3 rounded border text-xs font-mono space-y-1">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground min-w-[60px] font-semibold">Input:</span>
                            <span className="text-blue-600 dark:text-blue-400">{tc.input}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground min-w-[60px] font-semibold">Expected:</span>
                            <span className="text-green-600 dark:text-green-400">{tc.expected}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ℹ️ Hidden test cases ({testCases.filter(tc => tc.hidden).length}) will only run during submission
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </Fade>

        <Fade delay={600}>
          <Card>
            <CardHeader>
              <CardTitle>Starter Code</CardTitle>
              <CardDescription>
                Provide starter code templates for different languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(starterCode).map(([lang, code]) => (
                <div key={lang} className="space-y-2">
                  <Label className="capitalize">{lang}</Label>
                  <textarea
                    className="w-full h-32 p-3 font-mono text-sm border rounded-md bg-background"
                    placeholder={`Enter ${lang} starter code...`}
                    value={code}
                    onChange={(e) => setStarterCode({ ...starterCode, [lang]: e.target.value })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </Fade>

        <Fade delay={700}>
          <Card>
            <CardHeader>
              <CardTitle>Driver Code (Optional)</CardTitle>
              <CardDescription>
                Provide driver/test harness code for execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(driverCode).map(([lang, code]) => (
                <div key={lang} className="space-y-2">
                  <Label className="capitalize">{lang}</Label>
                  <textarea
                    className="w-full h-32 p-3 font-mono text-sm border rounded-md bg-background"
                    placeholder={`Enter ${lang} driver code...`}
                    value={code}
                    onChange={(e) => setDriverCode({ ...driverCode, [lang]: e.target.value })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </Fade>
      </div>
    </form>
  );
}
