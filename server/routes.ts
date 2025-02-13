import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPessoaSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.get("/api/pessoas", async (_req, res) => {
    const pessoas = await storage.getPessoas();
    res.json(pessoas);
  });

  app.post("/api/pessoas", async (req, res) => {
    const result = insertPessoaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const pessoa = await storage.createPessoa(result.data);
    res.status(201).json(pessoa);
  });

  app.put("/api/pessoas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertPessoaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const pessoa = await storage.updatePessoa(id, result.data);
    if (!pessoa) {
      return res.status(404).json({ message: "Pessoa não encontrada" });
    }
    res.json(pessoa);
  });

  app.delete("/api/pessoas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deletePessoa(id);
    if (!success) {
      return res.status(404).json({ message: "Pessoa não encontrada" });
    }
    res.status(204).end();
  });

  return createServer(app);
}
