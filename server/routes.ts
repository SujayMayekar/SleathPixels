import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Minimal backend route just to support the architecture
  app.post(api.log.create.path, async (req, res) => {
    try {
      const input = api.log.create.input.parse(req.body);
      await storage.logAction(input);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  });

  return httpServer;
}
