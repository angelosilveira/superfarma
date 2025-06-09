
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Employee } from '@/interfaces/employee.interface';

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'João Silva',
    position: 'Farmacêutico',
    phone: '11987654321',
    email: 'joao@farmacia.com',
    admissionDate: '2023-01-15',
    status: 'active',
    salary: 5000,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Maria Santos',
    position: 'Atendente',
    phone: '11987654322',
    email: 'maria@farmacia.com',
    admissionDate: '2023-06-01',
    status: 'active',
    salary: 2500,
    createdAt: '2023-06-01',
    updatedAt: '2024-01-01'
  }
];

export const Employees: React.FC = () => {
  const [employees] = useState<Employee[]>(mockEmployees);

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
      key: 'position',
      label: 'Cargo',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Telefone',
      sortable: true
    },
    {
      key: 'admissionDate',
      label: 'Data de Admissão',
      render: (employee: Employee) => formatDate(employee.admissionDate)
    },
    {
      key: 'status',
      label: 'Status',
      render: (employee: Employee) => (
        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
          {employee.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (employee: Employee) => (
        <div className="flex gap-2">
          <Link to={`/employees/edit/${employee.id}`}>
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
            <h1 className="text-title font-light text-gray-900">Colaboradores</h1>
            <p className="text-body text-gray-600">Gerencie seus colaboradores</p>
          </div>
          <Link to="/employees/new">
            <Button icon={Plus}>
              Novo Colaborador
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={employees}
            columns={columns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
