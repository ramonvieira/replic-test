import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pessoas = pgTable("pessoas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cpf: text("cpf").notNull().unique(),
  site: text("site"),
  dataNascimento: timestamp("data_nascimento"),
  estadoCivil: text("estado_civil"),
  sexo: text("sexo"),
  tipoPessoa: text("tipo_pessoa"),
  nacionalidade: text("nacionalidade"),
  telefone: text("telefone"),
  comentario: text("comentario"),
});

export const insertPessoaSchema = createInsertSchema(pessoas)
  .omit({ id: true })
  .extend({
    cpf: z.string().min(11).max(14),
    site: z.string().nullish(),
    dataNascimento: z.string().nullish(),
    estadoCivil: z.string().nullish(),
    sexo: z.string().nullish(),
    tipoPessoa: z.string().nullish(),
    nacionalidade: z.string().nullish(),
    telefone: z.string().nullish(),
    comentario: z.string().nullish(),
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