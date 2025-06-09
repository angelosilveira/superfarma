import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { DataTable } from "@/components/organisms/DataTable";
import { Plus, Pencil, Trash2, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { Supplier } from "@/interfaces/supplier.interface";
import { SuppliersService } from "@/services/suppliers.service";
import { useToast } from "@/hooks/use-toast";
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

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await SuppliersService.list();
      setSuppliers(data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await SuppliersService.delete(id);
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      setSupplierToDelete(null);
      toast({
        description: "Fornecedor excluído com sucesso",
      });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o fornecedor",
        variant: "destructive",
      });
    }
  };
  const columns = [
    {
      key: "nome",
      label: "Nome",
      sortable: true,
    },
    {
      key: "empresa",
      label: "Empresa",
      sortable: true,
    },
    {
      key: "contato",
      label: "Contato",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "actions",
      label: "Ações",
      render: (supplier: Supplier) => (
        <div className="flex gap-2">
          <Link to={`/suppliers/edit/${supplier.id}`}>
            <Button variant="ghost" size="sm" icon={Pencil}>
              Editar
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => setSupplierToDelete(supplier)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-title font-light text-gray-900">
              Fornecedores
            </h1>
            <p className="text-body text-gray-600">
              Gerencie os fornecedores cadastrados
            </p>
          </div>
          <Link to="/suppliers/new">
            <Button icon={Plus}>Novo Fornecedor</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full" />
              <p className="mt-4 text-gray-600">Carregando fornecedores...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Box className="h-full w-full" />
              </div>
              <p className="mt-4">Nenhum fornecedor cadastrado</p>
              <Link to="/suppliers/new" className="mt-4 inline-block">
                <Button variant="link" icon={Plus}>
                  Criar primeiro fornecedor
                </Button>
              </Link>
            </div>
          ) : (
            <DataTable data={suppliers} columns={columns} />
          )}
        </div>
      </div>

      <AlertDialog
        open={!!supplierToDelete}
        onOpenChange={() => setSupplierToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              fornecedor "{supplierToDelete?.nome}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                supplierToDelete && handleDelete(supplierToDelete.id)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};
