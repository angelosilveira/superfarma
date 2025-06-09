
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Supplier } from '@/interfaces/supplier.interface';

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'João Fornecedor',
    company: 'Distribuidora ABC',
    phone: '11987654321',
    email: 'joao@distribuidora.com',
    cnpj: '12.345.678/0001-90',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Maria Fornecedora',
    company: 'Farmacêutica XYZ',
    phone: '11987654322',
    email: 'maria@farmaceutica.com',
    cnpj: '98.765.432/0001-10',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  }
];

export const Suppliers: React.FC = () => {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true
    },
    {
      key: 'company',
      label: 'Empresa',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Telefone',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (supplier: Supplier) => (
        <div className="flex gap-2">
          <Link to={`/suppliers/edit/${supplier.id}`}>
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
            <h1 className="text-title font-light text-gray-900">Fornecedores</h1>
            <p className="text-body text-gray-600">Gerencie seus fornecedores</p>
          </div>
          <Link to="/suppliers/new">
            <Button icon={Plus}>
              Novo Fornecedor
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={suppliers}
            columns={columns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
