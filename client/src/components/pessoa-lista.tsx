import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { type Pessoa } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PessoaListaProps {
  onEdit: (pessoa: Pessoa) => void;
}

export default function PessoaLista({ onEdit }: PessoaListaProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: pessoas, isLoading } = useQuery<Pessoa[]>({
    queryKey: ["/api/pessoas"],
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await apiRequest("DELETE", `/api/pessoas/${deleteId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: "Sucesso",
        description: "Cadastro excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o cadastro.",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!pessoas?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="h-24 w-24 text-gray-300 mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Nenhuma pessoa cadastrada
        </h3>
        <p className="text-sm text-gray-500">
          Clique no botão "Nova Pessoa" para começar a cadastrar.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pessoas.map((pessoa) => (
            <TableRow key={pessoa.id}>
              <TableCell>{pessoa.nome}</TableCell>
              <TableCell>{pessoa.cpf}</TableCell>
              <TableCell>{pessoa.telefone}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(pessoa)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(pessoa.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cadastro? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}