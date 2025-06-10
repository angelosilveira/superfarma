import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { DataTable } from "@/components/organisms/DataTable";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CashRegister } from "@/interfaces/cash-register.interface";
import { CashRegisterService } from "@/services/cash-register.service";
import { toast } from "@/hooks/use-toast";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: CashRegister) => React.ReactNode;
}

export const CashRegisterPage: React.FC = () => {
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCashRegisters = async () => {
    try {
      const data = await CashRegisterService.getAll();
      setCashRegisters(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar fechamentos",
        description: "Não foi possível carregar os fechamentos de caixa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCashRegisters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este fechamento?")) {
      return;
    }

    try {
      await CashRegisterService.delete(id);
      toast({
        title: "Fechamento excluído",
        description: "O fechamento foi excluído com sucesso.",
      });
      loadCashRegisters();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o fechamento.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const columns: Column[] = [
    {
      key: "responsavel_nome",
      label: "Responsável",
      sortable: true,
    },
    {
      key: "data_fechamento",
      label: "Data",
      render: (item: CashRegister) => formatDate(item.data_fechamento),
      sortable: true,
    },
    {
      key: "valor_inicial",
      label: "Valor Inicial",
      render: (item: CashRegister) => formatCurrency(item.valor_inicial),
    },
    {
      key: "total",
      label: "Total",
      render: (item: CashRegister) => formatCurrency(item.total),
    },
    {
      key: "diferenca",
      label: "Diferença",
      render: (item: CashRegister) => formatCurrency(item.diferenca),
    },
    {
      key: "actions",
      label: "Ações",
      render: (item: CashRegister) => (
        <div className="flex gap-2">
          <Link to={`/cash-register/edit/${item.id}`}>
            <Button variant="ghost" size="sm" icon={Pencil}>
              Editar
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(item.id)}
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
              Fechamento de Caixa
            </h1>
            <p className="text-body text-gray-600">
              Gerencie os fechamentos de caixa
            </p>
          </div>
          <Link to="/cash-register/new">
            <Button icon={Plus}>Novo Fechamento</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={cashRegisters}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
