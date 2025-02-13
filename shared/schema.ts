import { pgTable, text, serial, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pessoas = pgTable("pessoas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cpf: text("cpf").notNull().unique(),
  site: text("site"),
  dataNascimento: date("data_nascimento"),
  estadoCivil: text("estado_civil"),
  sexo: text("sexo"),
  tipoPessoa: text("tipo_pessoa"),
  nacionalidade: text("nacionalidade"),
  telefone: text("telefone"),
});

export const insertPessoaSchema = createInsertSchema(pessoas)
  .omit({ id: true })
  .extend({
    cpf: z.string().min(11).max(14),
  });

export type InsertPessoa = z.infer<typeof insertPessoaSchema>;
export type Pessoa = typeof pessoas.$inferSelect;

export const estadosCivis = [
  "Solteiro",
  "Casado",
  "Divorciado",
  "Viúvo",
  "Separado",
] as const;

export const sexos = ["Masculino", "Feminino", "Outro"] as const;
export const tiposPessoa = ["Física", "Jurídica"] as const;
