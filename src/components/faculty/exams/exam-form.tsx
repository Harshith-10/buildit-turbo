"use client";

import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createExam, updateExam } from "@/actions/faculty/exams";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { QuestionsSelector } from "@/components/faculty/collections/questions-selector";
import { CollectionsSelector } from "@/components/faculty/exams/collections-selector";
import { DistributionCalculator } from "@/components/faculty/exams/distribution-calculator";
import { ExamSessionsList } from "@/components/faculty/exams/exam-sessions-list";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Distribution, MarksPerDifficulty } from "@/lib/exam-utils";
import { cn } from "@/lib/utils";

interface ExamFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    description: string;
    duration: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    status: "draft" | "upcoming" | "live" | "completed" | "missed";
    totalQuestions: number | null;
    totalMarks: number | null;
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
    marksPerDifficulty: MarksPerDifficulty | null;
    allowedDistributions: Distribution[] | null;
    questions?: { id: string; points: number }[];
    collections?: { id: string }[];
  };
  isEditing?: boolean;
}

export function ExamForm({ initialData, isEditing = false }: ExamFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 60,
    startDate: initialData?.startDate
      ? new Date(initialData.startDate)
      : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    status: initialData?.status || "draft",
    totalQuestions: initialData?.totalQuestions || 0,
    totalMarks: initialData?.totalMarks || 100,
    difficulty: (initialData?.difficulty || "medium") as
      | "easy"
      | "medium"
      | "hard",
    category: initialData?.category || "general",
  });

  const [marksPerDifficulty, setMarksPerDifficulty] =
    useState<MarksPerDifficulty>(
      initialData?.marksPerDifficulty || { easy: 1, medium: 2, hard: 3 },
    );

  const [allowedDistributions, setAllowedDistributions] = useState<
    Distribution[]
  >(initialData?.allowedDistributions || []);

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(
    initialData?.questions?.map((q) => q.id) || [],
  );

  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialData?.collections?.map((c) => c.id) || [],
  );

  const [questionPoints, setQuestionPoints] = useState<Record<string, number>>(
    initialData?.questions?.reduce(
      (acc, q) => ({ ...acc, [q.id]: q.points || 10 }),
      {} as Record<string, number>,
    ) || {},
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

  const handleQuestionSelection = (ids: string[]) => {
    setSelectedQuestions(ids);
    const newPoints = { ...questionPoints };
    // biome-ignore lint/complexity/noForEach: <explanation>
    ids.forEach((id) => {
      if (!newPoints[id]) {
        newPoints[id] = 10;
      }
    });
    setQuestionPoints(newPoints);
  };

  const handlePointsChange = (id: string, points: number) => {
    setQuestionPoints((prev) => ({ ...prev, [id]: points }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.startDate || !formData.endDate) {
        toast.error("Please select both start and end dates");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        startDate: formData.startDate,
        endDate: formData.endDate,
        marksPerDifficulty,
        allowedDistributions,
        questions: selectedQuestions.map((id) => ({
          problemId: id,
          points: questionPoints[id] || 10,
        })),
        collections: selectedCollections.map((id) => ({ collectionId: id })),
      };

      if (isEditing && initialData?.id) {
        const res = await updateExam(initialData.id, payload);
        if (res.success) {
          toast.success("Exam updated successfully");
          router.push("/faculty/exams");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to update exam");
        }
      } else {
        const res = await createExam(payload);
        if (res.success) {
          toast.success("Exam created successfully");
          router.push("/faculty/exams");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to create exam");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <TabsList
              className={cn(
                "grid w-full max-w-2xl",
                isEditing ? "grid-cols-4" : "grid-cols-3",
              )}
            >
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              {isEditing && (
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              )}
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
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Update Exam"
                ) : (
                  "Create Exam"
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="details"
              className="h-full mt-0 overflow-y-auto pr-2"
            >
              <Fade delay={100}>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Exam Information</CardTitle>
                      <CardDescription>
                        Configure the basic details of your exam
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Midterm Exam - Data Structures"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">Slug (Optional)</Label>
                          <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="Auto-generated if empty"
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
                          placeholder="Describe the exam objectives and topics..."
                          rows={4}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule & Settings</CardTitle>
                      <CardDescription>
                        Set the exam timing and configuration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Exam Window</Label>
                          <div className="flex gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !formData.startDate &&
                                      "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.startDate ? (
                                    format(formData.startDate, "PPP")
                                  ) : (
                                    <span>Start Date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.startDate}
                                  onSelect={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      startDate: date,
                                    }))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !formData.endDate &&
                                      "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.endDate ? (
                                    format(formData.endDate, "PPP")
                                  ) : (
                                    <span>End Date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.endDate}
                                  onSelect={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      endDate: date,
                                    }))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2 w-full">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              name="duration"
                              type="number"
                              value={formData.duration}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(val) =>
                            handleSelectChange("status", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="upcoming">
                              Publish (Upcoming)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Set to "Publish" to schedule the exam. It will
                          automatically go live at the start date.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Fade>
            </TabsContent>

            <TabsContent
              value="content"
              className="h-full mt-0 overflow-y-auto pr-2"
            >
              <Fade delay={100}>
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Collections</CardTitle>
                      <CardDescription>
                        Link entire collections of questions to this exam
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CollectionsSelector
                        selectedIds={selectedCollections}
                        onSelectionChange={setSelectedCollections}
                      />
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Direct Questions</CardTitle>
                        <CardDescription>
                          Add specific questions directly to the exam
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <QuestionsSelector
                          selectedIds={selectedQuestions}
                          onSelectionChange={handleQuestionSelection}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Configure Points (Direct Questions)
                        </CardTitle>
                        <CardDescription>
                          Assign points to directly added questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedQuestions.length === 0 ? (
                          <div className="text-muted-foreground text-sm border rounded-md p-8 text-center">
                            Select questions from the left to configure points.
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {selectedQuestions.map((id) => (
                              <div
                                key={id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                              >
                                <span className="text-sm font-medium truncate max-w-[200px]">
                                  Question ID: {id.substring(0, 8)}...
                                </span>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor={`points-${id}`}
                                    className="text-xs"
                                  >
                                    Points
                                  </Label>
                                  <Input
                                    id={`points-${id}`}
                                    type="number"
                                    value={questionPoints[id] || 10}
                                    onChange={(e) =>
                                      handlePointsChange(
                                        id,
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-20 h-8"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Fade>
            </TabsContent>

            <TabsContent
              value="distribution"
              className="h-full mt-0 overflow-y-auto pr-2"
            >
              <Fade delay={100}>
                <DistributionCalculator
                  totalQuestions={Number(formData.totalQuestions)}
                  totalMarks={Number(formData.totalMarks)}
                  marksPerDifficulty={marksPerDifficulty}
                  allowedDistributions={allowedDistributions}
                  onAllowedDistributionsChange={setAllowedDistributions}
                  onConfigurationChange={(config) => {
                    if (config.totalQuestions !== undefined) {
                      setFormData((prev) => ({
                        ...prev,
                        totalQuestions: config.totalQuestions!,
                      }));
                    }
                    if (config.totalMarks !== undefined) {
                      setFormData((prev) => ({
                        ...prev,
                        totalMarks: config.totalMarks!,
                      }));
                    }
                    if (config.marksPerDifficulty) {
                      setMarksPerDifficulty(config.marksPerDifficulty);
                    }
                  }}
                />
              </Fade>
            </TabsContent>

            {isEditing && initialData?.id && (
              <TabsContent
                value="sessions"
                className="h-full mt-0 overflow-y-auto pr-2"
              >
                <Fade delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Exam Sessions</CardTitle>
                      <CardDescription>
                        View and manage student exam sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExamSessionsList examId={initialData.id} />
                    </CardContent>
                  </Card>
                </Fade>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </form>
  );
}
