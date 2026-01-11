import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't strictly need a database for a client-side app, 
// but we'll set up a basic schema structure to follow the architecture
// and allow for future enhancements (e.g. saving history).

export const steganographyLogs = pgTable("steganography_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(), // 'encode' or 'decode'
  timestamp: text("timestamp").notNull(),
});

export const insertLogSchema = createInsertSchema(steganographyLogs).pick({
  action: true,
  timestamp: true,
});

export type InsertLog = z.infer<typeof insertLogSchema>;
export type Log = typeof steganographyLogs.$inferSelect;
