import { pessoas, type Pessoa, type InsertPessoa } from "@shared/schema";

export interface IStorage {
  getPessoas(): Promise<Pessoa[]>;
  getPessoa(id: number): Promise<Pessoa | undefined>;
  createPessoa(pessoa: InsertPessoa): Promise<Pessoa>;
  updatePessoa(id: number, pessoa: InsertPessoa): Promise<Pessoa | undefined>;
  deletePessoa(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private pessoas: Map<number, Pessoa>;
  private currentId: number;

  constructor() {
    this.pessoas = new Map();
    this.currentId = 1;
  }

  async getPessoas(): Promise<Pessoa[]> {
    return Array.from(this.pessoas.values());
  }

  async getPessoa(id: number): Promise<Pessoa | undefined> {
    return this.pessoas.get(id);
  }

  async createPessoa(insertPessoa: InsertPessoa): Promise<Pessoa> {
    const id = this.currentId++;
    const pessoa: Pessoa = { ...insertPessoa, id };
    this.pessoas.set(id, pessoa);
    return pessoa;
  }

  async updatePessoa(id: number, data: InsertPessoa): Promise<Pessoa | undefined> {
    const existing = await this.getPessoa(id);
    if (!existing) return undefined;

    const updated: Pessoa = { ...data, id };
    this.pessoas.set(id, updated);
    return updated;
  }

  async deletePessoa(id: number): Promise<boolean> {
    return this.pessoas.delete(id);
  }
}

export const storage = new MemStorage();
