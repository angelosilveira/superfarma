import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { DataTable } from "@/components/organisms/DataTable";
import { Plus, Pencil, Trash2, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { Employee } from "@/interfaces/employee.interface";
import { EmployeesService } from "@/services/employees.service";
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

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await EmployeesService.list();
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os colaboradores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await EmployeesService.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setEmployeeToDelete(null);
      toast({
        description: "Colaborador excluído com sucesso",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o colaborador",
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
      key: "cargo",
      label: "Cargo",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "telefone",
      label: "Telefone",
      sortable: true,
    },
    {
      key: "data_admissao",
      label: "Data de Admissão",
      sortable: true,
      render: (employee: Employee) =>
        new Date(employee.data_admissao).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      label: "Ações",
      render: (employee: Employee) => (
        <div className="flex gap-2">
          <Link to={`/employees/edit/${employee.id}`}>
            <Button variant="ghost" size="sm" icon={Pencil}>
              Editar
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => setEmployeeToDelete(employee)}
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
              Colaboradores
            </h1>
            <p className="text-body text-gray-600">
              Gerencie os colaboradores cadastrados
            </p>
          </div>
          <Link to="/employees/new">
            <Button icon={Plus}>Novo Colaborador</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full" />
              <p className="mt-4 text-gray-600">Carregando colaboradores...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Box className="h-full w-full" />
              </div>
              <p className="mt-4">Nenhum colaborador cadastrado</p>
              <Link to="/employees/new" className="mt-4 inline-block">
                <Button variant="link" icon={Plus}>
                  Criar primeiro colaborador
                </Button>
              </Link>
            </div>
          ) : (
            <DataTable data={employees} columns={columns} />
          )}
        </div>
      </div>

      <AlertDialog
        open={!!employeeToDelete}
        onOpenChange={() => setEmployeeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              colaborador "{employeeToDelete?.nome}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                employeeToDelete && handleDelete(employeeToDelete.id)
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
