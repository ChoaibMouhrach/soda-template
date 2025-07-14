CREATE TYPE "public"."tokenTypes" AS ENUM('email-confirmation', 'reset-password');--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "type" "tokenTypes" NOT NULL;