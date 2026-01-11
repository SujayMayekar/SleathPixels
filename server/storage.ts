import { db } from "./db";
import { steganographyLogs, type InsertLog } from "@shared/schema";

export interface IStorage {
  logAction(log: InsertLog): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async logAction(log: InsertLog): Promise<void> {
    await db.insert(steganographyLogs).values(log);
  }
}

export const storage = new DatabaseStorage();
