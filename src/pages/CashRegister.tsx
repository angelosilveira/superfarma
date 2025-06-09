
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CashRegister as CashRegisterInterface } from '@/interfaces/cash-register.interface';

const mockCashRegisters: CashRegisterInterface[] = [
  {
    id: '1',
    responsible: 'João Silva',
    date: '2024-01-15',
    totalAmount: 1500.00,
    observations: 'Movimento normal',
    initialAmount: 100.00,
    cash: 800.00,
    pix: 400.00,
    creditCard: 200.00,
    debitCard: 100.00,
    total: 1500.00,
    difference: 0,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    responsible: 'Maria Santos',
    date: '2024-01-16',
    totalAmount: 2000.00,
    observations: 'Dia de movimento intenso',
    initialAmount: 100.00,
    cash: 1000.00,
    pix: 600.00,
    creditCard: 300.00,
    debitCard: 100.00,
    total: 2000.00,
    difference: 0,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  }
];

export const CashRegisterPage: React.FC = () => {
  const [cashRegisters] = useState<CashRegisterInterface[]>(mockCashRegisters);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const columns = [
    {
      key: 'responsible',
      label: 'Responsável',
      sortable: true
    },
    {
      key: 'date',
      label: 'Data',
      render: (cashRegister: CashRegisterInterface) => formatDate(cashRegister.date),
      sortable: true
    },
    {
      key: 'totalAmount',
      label: 'Valor Total',
      render: (cashRegister: CashRegisterInterface) => formatCurrency(cashRegister.totalAmount)
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (cashRegister: CashRegisterInterface) => (
        <div className="flex gap-2">
          <Link to={`/cash-register/edit/${cashRegister.id}`}>
            <Button variant="ghost" size="sm" icon={Pencil}>
              Editar
            </Button>
          </Link>
          <Button variant="ghost" size="sm" icon={Trash2}>
            Excluir
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-title font-light text-gray-900">Fechamento de Caixa</h1>
            <p className="text-body text-gray-600">Gerencie os fechamentos de caixa</p>
          </div>
          <Link to="/cash-register/new">
            <Button icon={Plus}>
              Novo Fechamento
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={cashRegisters}
            columns={columns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
