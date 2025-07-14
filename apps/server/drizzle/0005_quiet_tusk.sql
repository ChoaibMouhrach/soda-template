ALTER TYPE "public"."tokenTypes" ADD VALUE 'change-email';--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "payload" jsonb;