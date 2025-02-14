import { z } from "zod";

export const estadosCivis = [
  "Solteiro",
  "Casado",
  "Divorciado",
  "Viúvo",
  "Separado",
] as const;

export const sexos = ["Masculino", "Feminino", "Outro"] as const;
export const tiposPessoa = ["Física", "Jurídica"] as const;

export const insertPessoaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
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

export interface Pessoa extends Omit<InsertPessoa, "dataNascimento"> {
  id: number;
  dataNascimento: Date | null;
}