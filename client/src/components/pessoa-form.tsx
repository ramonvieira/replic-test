import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertPessoaSchema, type InsertPessoa, type Pessoa, estadosCivis, sexos, tiposPessoa } from "@shared/schema";
import { PAISES } from "@/lib/constants";
import { formatCPF, validateCPF } from "@/lib/cpf";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/lib/indexedDB";

const schema = insertPessoaSchema.extend({
  cpf: insertPessoaSchema.shape.cpf.refine(
    (cpf) => validateCPF(cpf),
    { message: "CPF inválido" }
  )
});

interface PessoaFormProps {
  pessoa?: Pessoa | null;
  onSuccess: () => void;
}

export default function PessoaForm({ pessoa, onSuccess }: PessoaFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPessoa>({
    resolver: zodResolver(schema),
    defaultValues: pessoa ? {
      nome: pessoa.nome,
      cpf: pessoa.cpf,
      site: pessoa.site || "",
      dataNascimento: pessoa.dataNascimento?.toString() || "",
      estadoCivil: pessoa.estadoCivil || "",
      sexo: pessoa.sexo || "",
      tipoPessoa: pessoa.tipoPessoa || "Física",
      nacionalidade: pessoa.nacionalidade || "Brasil",
      telefone: pessoa.telefone || "",
      comentario: pessoa.comentario || "",
    } : {
      nome: "",
      cpf: "",
      site: "",
      dataNascimento: "",
      estadoCivil: "",
      sexo: "",
      tipoPessoa: "Física",
      nacionalidade: "Brasil",
      telefone: "",
      comentario: "",
    },
  });

  const onSubmit = async (data: InsertPessoa) => {
    try {
      // Verificar se já existe uma pessoa com o mesmo CPF
      const pessoas = await indexedDBService.getAll();
      const existingPessoa = pessoas.find(p => p.cpf === data.cpf && p.id !== pessoa?.id);

      if (existingPessoa) {
        toast({
          title: "CPF já cadastrado",
          description: "Já existe uma pessoa cadastrada com este CPF.",
          variant: "destructive",
        });
        return;
      }

      const pessoaData: Pessoa = {
        id: pessoa?.id || Date.now(),
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

      if (pessoa) {
        await indexedDBService.update(pessoaData);
      } else {
        await indexedDBService.add(pessoaData);
      }

      queryClient.invalidateQueries({ queryKey: ["pessoas"] });
      toast({
        title: pessoa ? "Cadastro atualizado" : "Cadastro realizado",
        description: "Os dados foram salvos com sucesso.",
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estadoCivil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estadosCivis.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sexos.map((sexo) => (
                          <SelectItem key={sexo} value={sexo}>
                            {sexo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoPessoa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Pessoa</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposPessoa.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nacionalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nacionalidade</FormLabel>
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAISES.map((pais) => (
                        <SelectItem key={pais} value={pais}>
                          {pais}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}