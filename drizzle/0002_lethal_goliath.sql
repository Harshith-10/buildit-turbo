ALTER TABLE "submissions" ADD COLUMN "test_case_results" jsonb;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "total_tests" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "passed_tests" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "compilation_error" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "execution_error" text;