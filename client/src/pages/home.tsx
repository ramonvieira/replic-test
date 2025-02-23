import { useState } from "react";
import PessoaForm from "@/components/pessoa-form";
import PessoaLista from "@/components/pessoa-lista";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type Pessoa } from "@shared/schema";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);

  const handleEdit = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPessoa(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Cadastro de Pessoas
        </h1>
        <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Pessoa
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingPessoa ? (
                <>
                  Editando pessoa
                  <span className="bg-primary/10 text-primary rounded px-2 py-1 text-sm">
                    #{editingPessoa.id}
                  </span>
                </>
              ) : (
                "Novo Cadastro"
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <PessoaForm
              pessoa={editingPessoa}
              onSuccess={handleClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      <PessoaLista onEdit={handleEdit} />
    </div>
  );
}