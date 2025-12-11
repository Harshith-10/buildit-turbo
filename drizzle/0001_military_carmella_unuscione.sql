ALTER TABLE "problems" ALTER COLUMN "examples" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "examples" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "constraints" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "constraints" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "starter_code" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "starter_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "driver_code" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "driver_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "test_cases" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "test_cases" SET NOT NULL;