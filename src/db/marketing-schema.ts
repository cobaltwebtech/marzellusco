import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
	id: text("id").primaryKey(),
	fullname: text("fullname").notNull(),
	email: text("email").notNull(),
	phone: text("phone"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});
