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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Users, ArrowUpDown, MessageSquare } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { type Pessoa } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/lib/indexedDB";

interface PessoaListaProps {
  onEdit: (pessoa: Pessoa) => void;
}

type SortConfig = {
  column: keyof Pessoa;
  direction: 'asc' | 'desc';
};

export default function PessoaLista({ onEdit }: PessoaListaProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'nome', direction: 'asc' });
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const itemsPerPage = 20;

  const { data: pessoas = [], isLoading, refetch } = useQuery<Pessoa[]>({
    queryKey: ["pessoas"],
    queryFn: async () => {
      try {
        const data = await indexedDBService.getAll();
        return data;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        return [];
      }
    }
  });

  // Inicializa o IndexedDB quando o componente montar
  useEffect(() => {
    indexedDBService.init().catch(console.error);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await indexedDBService.delete(deleteId);
      queryClient.invalidateQueries({ queryKey: ["pessoas"] });
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

  const handleSort = (column: keyof Pessoa) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredPessoas.map(p => p.id);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleAddComment = async () => {
    try {
      for (const id of selectedIds) {
        const pessoa = await indexedDBService.get(id);
        if (pessoa) {
          await indexedDBService.update({
            ...pessoa,
            comentario: comment
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["pessoas"] });
      setCommentModalOpen(false);
      setComment("");
      setSelectedIds(new Set());
      toast({
        title: "Sucesso",
        description: "Comentários adicionados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar os comentários.",
        variant: "destructive",
      });
    }
  };

  const filteredPessoas = useMemo(() => {
    return pessoas
      .filter(pessoa => 
        Object.values(pessoa)
          .some(value => 
            String(value)
              .toLowerCase()
              .includes(filterText.toLowerCase())
          )
      )
      .sort((a, b) => {
        const aValue = String(a[sortConfig.column] || '');
        const bValue = String(b[sortConfig.column] || '');
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [pessoas, filterText, sortConfig]);

  const paginatedPessoas = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPessoas.slice(start, end);
  }, [filteredPessoas, page]);

  const totalPages = Math.ceil((filteredPessoas?.length || 0) / itemsPerPage);

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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Filtrar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="max-w-sm"
          />
          {selectedIds.size > 0 && (
            <Button onClick={() => setCommentModalOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Adicionar Comentário ({selectedIds.size})
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedIds.size === paginatedPessoas.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('nome')}
                  className="flex items-center"
                >
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('cpf')}
                  className="flex items-center"
                >
                  CPF
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('telefone')}
                  className="flex items-center"
                >
                  Telefone
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPessoas.map((pessoa) => (
              <ContextMenu key={pessoa.id}>
                <ContextMenuTrigger>
                  <TableRow
                    onDoubleClick={() => onEdit(pessoa)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(pessoa.id)}
                        onCheckedChange={(checked) => handleSelectOne(pessoa.id, !!checked)}
                      />
                    </TableCell>
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
                      {pessoa.comentario && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(pessoa)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => onEdit(pessoa)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => setDeleteId(pessoa.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="py-2">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>

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

      <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Comentário</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Digite o comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddComment}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}