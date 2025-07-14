ALTER TABLE "emailConfirmationTokens" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailConfirmedAt" timestamp;