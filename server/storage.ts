import { type Pessoa, type InsertPessoa } from "@shared/schema";

export interface IStorage {
  getPessoas(): Promise<Pessoa[]>;
  getPessoa(id: number): Promise<Pessoa | undefined>;
  createPessoa(pessoa: InsertPessoa): Promise<Pessoa>;
  updatePessoa(id: number, pessoa: InsertPessoa): Promise<Pessoa | undefined>;
  deletePessoa(id: number): Promise<boolean>;
}

class MemoryStorage implements IStorage {
  private pessoas: Pessoa[] = [];
  private nextId = 1;

  async getPessoas(): Promise<Pessoa[]> {
    return this.pessoas;
  }

  async getPessoa(id: number): Promise<Pessoa | undefined> {
    return this.pessoas.find(p => p.id === id);
  }

  async createPessoa(insertPessoa: InsertPessoa): Promise<Pessoa> {
    const pessoa: Pessoa = {
      id: this.nextId++,
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
    };
    this.pessoas.push(pessoa);
    return pessoa;
  }

  async updatePessoa(id: number, data: InsertPessoa): Promise<Pessoa | undefined> {
    const index = this.pessoas.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updated: Pessoa = {
      id,
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
    };

    this.pessoas[index] = updated;
    return updated;
  }

  async deletePessoa(id: number): Promise<boolean> {
    const index = this.pessoas.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.pessoas.splice(index, 1);
    return true;
  }
}

export const storage = new MemoryStorage();