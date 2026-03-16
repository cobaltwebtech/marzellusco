import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
	id: text("id").primaryKey(),
	firstname: text("firstname").notNull(),
	lastname: text("lastname").notNull(),
	email: text("email").notNull(),
	phone: text("phone"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	klaviyoProfileId: text("klaviyo_profile_id"),
});
