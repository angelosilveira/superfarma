
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Save, ArrowLeft } from 'lucide-react';
import { SupplierFormData } from '@/interfaces/supplier.interface';

export const SupplierForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    cnpj: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Supplier data:', formData);
    navigate('/suppliers');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value
      }
    }));
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/suppliers')}>
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit ? 'Edite as informações do fornecedor' : 'Adicione um novo fornecedor'}
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
                label="Empresa *"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
              />
              <Input
                label="Telefone *"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <Input
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Rua"
                  value={formData.address?.street || ''}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                />
                <Input
                  label="Número"
                  value={formData.address?.number || ''}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                />
                <Input
                  label="Complemento"
                  value={formData.address?.complement || ''}
                  onChange={(e) => handleAddressChange('complement', e.target.value)}
                />
                <Input
                  label="Bairro"
                  value={formData.address?.neighborhood || ''}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                />
                <Input
                  label="Cidade"
                  value={formData.address?.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
                <Input
                  label="Estado"
                  value={formData.address?.state || ''}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                />
                <Input
                  label="CEP"
                  value={formData.address?.zipCode || ''}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" icon={Save}>
                {isEdit ? 'Salvar Alterações' : 'Criar Fornecedor'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
