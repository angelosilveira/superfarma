
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { WhatsAppButton } from '@/components/molecules/WhatsAppButton';
import { Badge } from '@/components/ui/badge';
import { Plus, FileDown, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Customer } from '@/interfaces/customer.interface';

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '11987654321',
    email: 'joao@email.com',
    status: 'active',
    outstandingBalance: 150.00,
    lastPurchase: '2024-01-15',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Maria Santos',
    phone: '11987654322',
    email: 'maria@email.com',
    status: 'active',
    outstandingBalance: 0,
    lastPurchase: '2024-01-20',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-20'
  }
];

export const Customers: React.FC = () => {
  const [customers] = useState<Customer[]>(mockCustomers);

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
      key: 'name',
      label: 'Nome',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Contato',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      render: (customer: Customer) => (
        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
          {customer.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
    {
      key: 'outstandingBalance',
      label: 'Saldo Devedor',
      render: (customer: Customer) => (
        <span className={customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}>
          {formatCurrency(customer.outstandingBalance)}
        </span>
      )
    },
    {
      key: 'lastPurchase',
      label: 'Última Compra',
      render: (customer: Customer) => customer.lastPurchase ? formatDate(customer.lastPurchase) : '-'
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (customer: Customer) => (
        <div className="flex gap-2">
          <Link to={`/customers/edit/${customer.id}`}>
            <Button variant="ghost" size="sm" icon={Pencil}>
              Editar
            </Button>
          </Link>
          <Button variant="ghost" size="sm" icon={Trash2}>
            Excluir
          </Button>
          {customer.outstandingBalance > 0 && (
            <WhatsAppButton
              phoneNumber={customer.phone}
              message={`Olá ${customer.name}! Você possui um saldo pendente de ${formatCurrency(customer.outstandingBalance)}. Quando puder, passe na farmácia para regularizar. Obrigado!`}
              size="sm"
            />
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-title font-light text-gray-900">Clientes</h1>
            <p className="text-body text-gray-600">Gerencie seus clientes</p>
          </div>
          <div className="flex gap-3">
            <Link to="/customers/import">
              <Button variant="outline" icon={FileDown}>
                Importar Clientes
              </Button>
            </Link>
            <Link to="/customers/new">
              <Button icon={Plus}>
                Novo Cliente
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={customers}
            columns={columns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
