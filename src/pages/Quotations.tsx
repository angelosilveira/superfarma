import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Quotation } from "@/interfaces/quotation.interface";
import { useToast } from "@/hooks/use-toast";

type QuotationStatus = "pending" | "approved" | "rejected";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
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
    id: "orders",
    label: "Vendas",
    path: "/orders",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    id: "quotations",
    label: "Cotações",
    path: "/quotations",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "financial",
    label: "Financeiro",
    path: "/financial",
    icon: <DollarSign className="h-4 w-4" />,
    children: [
      {
        id: "accounts-payable",
        label: "Contas a Pagar",
        path: "/financial/accounts-payable",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        id: "accounts-receivable",
        label: "Contas a Receber",
        path: "/financial/accounts-receivable",
        icon: <DollarSign className="h-4 w-4" />,
      },
    ],
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
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(
    null
  );
  const { toast } = useToast();

  const fetchQuotations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("quotations")
        .select(
          `
          *,
          supplier:suppliers(*),
          product:products(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setQuotations(data);
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
    fetchQuotations();
  }, [fetchQuotations]);

  const handleSubmit = async (quotation: Partial<Quotation>) => {
    try {
      if (editingQuotation) {
        const { error } = await supabase
          .from("quotations")
          .update({
            ...quotation,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingQuotation.id);

        if (error) throw error;

        toast({
          title: "Cotação atualizada",
          description: "A cotação foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase.from("quotations").insert({
          ...quotation,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;

        toast({
          title: "Cotação criada",
          description: "A cotação foi criada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      setEditingQuotation(null);
      fetchQuotations();
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
      const { error } = await supabase.from("quotations").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Cotação excluída",
        description: "A cotação foi excluída com sucesso.",
      });

      fetchQuotations();
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

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("quotations")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `A cotação foi ${
          status === "approved" ? "aprovada" : "rejeitada"
        } com sucesso.`,
      });

      fetchQuotations();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setIsDialogOpen(true);
  };

  const filteredQuotations = (status?: QuotationStatus) => {
    return status ? quotations.filter((q) => q.status === status) : quotations;
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cotações</h1>
            <p className="text-muted-foreground">
              Gerencie as cotações de produtos com fornecedores
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Cotação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingQuotation ? "Editar Cotação" : "Nova Cotação"}
                </DialogTitle>
              </DialogHeader>
              <QuotationForm
                onSubmit={handleSubmit}
                initialData={editingQuotation}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Cotações</CardTitle>
                <CardDescription>
                  Lista completa de todas as cotações registradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuotationTable
                  quotations={filteredQuotations()}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotações Pendentes</CardTitle>
                <CardDescription>
                  Cotações que ainda aguardam análise e aprovação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuotationTable
                  quotations={filteredQuotations("pending")}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotações Aprovadas</CardTitle>
                <CardDescription>
                  Cotações que foram aprovadas e estão em processo de compra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuotationTable
                  quotations={filteredQuotations("approved")}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotações Rejeitadas</CardTitle>
                <CardDescription>
                  Cotações que foram rejeitadas ou canceladas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuotationTable
                  quotations={filteredQuotations("rejected")}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
