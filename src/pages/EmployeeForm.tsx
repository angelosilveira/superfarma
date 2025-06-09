
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Save, ArrowLeft } from 'lucide-react';
import { EmployeeFormData } from '@/interfaces/employee.interface';

export const EmployeeForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    position: '',
    phone: '',
    email: '',
    admissionDate: '',
    status: 'active',
    salary: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Employee data:', formData);
    navigate('/employees');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/employees')}>
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit ? 'Edite as informações do colaborador' : 'Adicione um novo colaborador'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <Input
                label="Cargo *"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                required
              />
              <Input
                label="Telefone *"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <Input
                label="Data de Admissão *"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                required
              />
              <div className="space-y-1">
                <label className="block text-label text-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <Input
                label="Salário"
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" icon={Save}>
                {isEdit ? 'Salvar Alterações' : 'Criar Colaborador'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
