import { pessoas, type Pessoa, type InsertPessoa } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPessoas(): Promise<Pessoa[]>;
  getPessoa(id: number): Promise<Pessoa | undefined>;
  createPessoa(pessoa: InsertPessoa): Promise<Pessoa>;
  updatePessoa(id: number, pessoa: InsertPessoa): Promise<Pessoa | undefined>;
  deletePessoa(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getPessoas(): Promise<Pessoa[]> {
    return await db.select().from(pessoas);
  }

  async getPessoa(id: number): Promise<Pessoa | undefined> {
    const [pessoa] = await db.select().from(pessoas).where(eq(pessoas.id, id));
    return pessoa;
  }

  async createPessoa(insertPessoa: InsertPessoa): Promise<Pessoa> {
    const [pessoa] = await db
      .insert(pessoas)
      .values({
        nome: insertPessoa.nome,
        cpf: insertPessoa.cpf,
        site: insertPessoa.site || null,
        dataNascimento: insertPessoa.dataNascimento ? new Date(insertPessoa.dataNascimento) : null,
        estadoCivil: insertPessoa.estadoCivil || null,
        sexo: insertPessoa.sexo || null,
        tipoPessoa: insertPessoa.tipoPessoa || null,
        nacionalidade: insertPessoa.nacionalidade || null,
        telefone: insertPessoa.telefone || null,
        comentario: insertPessoa.comentario || null,
      })
      .returning();
    return pessoa;
  }

  async updatePessoa(id: number, data: InsertPessoa): Promise<Pessoa | undefined> {
    const [pessoa] = await db
      .update(pessoas)
      .set({
        nome: data.nome,
        cpf: data.cpf,
        site: data.site || null,
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : null,
        estadoCivil: data.estadoCivil || null,
        sexo: data.sexo || null,
        tipoPessoa: data.tipoPessoa || null,
        nacionalidade: data.nacionalidade || null,
        telefone: data.telefone || null,
        comentario: data.comentario || null,
      })
      .where(eq(pessoas.id, id))
      .returning();
    return pessoa;
  }

  async deletePessoa(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(pessoas)
      .where(eq(pessoas.id, id))
      .returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();