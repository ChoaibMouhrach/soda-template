CREATE TABLE "appSecrets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"secret" uuid DEFAULT gen_random_uuid() NOT NULL,
	"appId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "appSecrets" ADD CONSTRAINT "appSecrets_appId_apps_id_fk" FOREIGN KEY ("appId") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;