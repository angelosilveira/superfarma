import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Home,
  ShoppingCart,
  Users,
  FileText,
  DollarSign,
  Settings,
  Package,
  Truck,
  Tag,
} from "lucide-react";
import { QuotationForm } from "@/components/molecules/QuotationForm";
import { QuotationTable } from "@/components/molecules/QuotationTable";
import { supabase } from "@/lib/supabase";
import { Cotacao } from "@/interfaces/quotation.interface";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "products",
    label: "Produtos",
    path: "/products",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "categories",
    label: "Categorias",
    path: "/categories",
    icon: <Tag className="h-4 w-4" />,
  },
  {
    id: "suppliers",
    label: "Fornecedores",
    path: "/suppliers",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    id: "customers",
    label: "Clientes",
    path: "/customers",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "quotations",
    label: "Cotações",
    path: "/quotations",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "finances",
    label: "Financeiro",
    path: "/finances",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export const Quotations: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [editingCotacao, setEditingCotacao] = useState<Cotacao | null>(null);
  const { toast } = useToast();

  const fetchCotacoes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("cotacoes")
        .select(
          `
          *,
          produto:produtos(*)
        `
        )
        .order("data_atualizacao", { ascending: false });

      if (error) throw error;
      if (data) setCotacoes(data);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao carregar cotações",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    fetchCotacoes();
  }, [fetchCotacoes]);

  const handleSubmit = async (cotacao: Partial<Cotacao>) => {
    try {
      if (editingCotacao) {
        const { error } = await supabase
          .from("cotacoes")
          .update({
            ...cotacao,
            data_atualizacao: new Date().toISOString(),
          })
          .eq("id", editingCotacao.id);

        if (error) throw error;

        toast({
          title: "Cotação atualizada",
          description: "A cotação foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase.from("cotacoes").insert({
          ...cotacao,
          data_atualizacao: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

        if (error) throw error;

        toast({
          title: "Cotação criada",
          description: "A cotação foi criada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      setEditingCotacao(null);
      fetchCotacoes();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao salvar cotação",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("cotacoes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Cotação excluída",
        description: "A cotação foi excluída com sucesso.",
      });

      fetchCotacoes();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao excluir cotação",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (cotacao: Cotacao) => {
    setEditingCotacao(cotacao);
    setIsDialogOpen(true);
  };

  const handleDuplicate = async (cotacao: Cotacao) => {
    const { id, created_at, ...cotacaoToCreate } = cotacao;
    try {
      const { error } = await supabase.from("cotacoes").insert({
        ...cotacaoToCreate,
        data_atualizacao: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Cotação duplicada",
        description: "A cotação foi duplicada com sucesso.",
      });

      fetchCotacoes();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao duplicar cotação",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="w-full mx-auto py-6">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 -mx-6 px-6 py-4 mb-6">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              <h1 className="text-2xl font-bold">
                Cotações por Produto ({cotacoes.length})
              </h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Cotação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCotacao ? "Editar Cotação" : "Nova Cotação"}
                  </DialogTitle>
                </DialogHeader>
                <QuotationForm
                  onSubmit={handleSubmit}
                  initialData={editingCotacao}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          <QuotationTable
            cotacoes={cotacoes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
