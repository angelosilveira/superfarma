
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category } from '@/interfaces/category.interface';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Medicamentos',
    description: 'Produtos farmacêuticos e medicamentos',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Cosméticos',
    description: 'Produtos de beleza e cuidados pessoais',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  }
];

export const Categories: React.FC = () => {
  const [categories] = useState<Category[]>(mockCategories);

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true
    },
    {
      key: 'description',
      label: 'Descrição',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (category: Category) => (
        <div className="flex gap-2">
          <Link to={`/categories/edit/${category.id}`}>
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
            <h1 className="text-title font-light text-gray-900">Categorias</h1>
            <p className="text-body text-gray-600">Gerencie as categorias de produtos</p>
          </div>
          <Link to="/categories/new">
            <Button icon={Plus}>
              Nova Categoria
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={categories}
            columns={columns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
