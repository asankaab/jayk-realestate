import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

// Additive migration for an existing installation with users and properties tables.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "watchlist" (
      "id" serial PRIMARY KEY NOT NULL,
      "owner_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "property_id" integer NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
      "save_key" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX "watchlist_owner_idx" ON "watchlist" USING btree ("owner_id");
    CREATE INDEX "watchlist_property_idx" ON "watchlist" USING btree ("property_id");
    CREATE UNIQUE INDEX "watchlist_save_key_idx" ON "watchlist" USING btree ("save_key");
    CREATE INDEX "watchlist_updated_at_idx" ON "watchlist" USING btree ("updated_at");
    CREATE INDEX "watchlist_created_at_idx" ON "watchlist" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE "watchlist";`)
}
