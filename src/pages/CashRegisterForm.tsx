
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Save, ArrowLeft } from 'lucide-react';
import { CashRegisterFormData } from '@/interfaces/cash-register.interface';

export const CashRegisterForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CashRegisterFormData>({
    responsible: '',
    date: new Date().toISOString().split('T')[0],
    observations: '',
    initialAmount: 100,
    cash: 0,
    pix: 0,
    creditCard: 0,
    debitCard: 0
  });

  const [total, setTotal] = useState(0);
  const [difference, setDifference] = useState(0);

  useEffect(() => {
    const calculatedTotal = formData.initialAmount + formData.cash + formData.pix + formData.creditCard + formData.debitCard;
    setTotal(calculatedTotal);
    setDifference(calculatedTotal - formData.initialAmount);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      total,
      difference
    };
    console.log('Cash register data:', finalData);
    navigate('/cash-register');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/cash-register')}>
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit ? 'Editar Fechamento de Caixa' : 'Novo Fechamento de Caixa'}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit ? 'Edite o fechamento de caixa' : 'Registre um novo fechamento de caixa'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Responsável *"
                value={formData.responsible}
                onChange={(e) => handleInputChange('responsible', e.target.value)}
                required
              />
              <Input
                label="Data *"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-label text-foreground">Observações</label>
              <textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Valores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Valor Inicial"
                  type="number"
                  step="0.01"
                  value={formData.initialAmount}
                  onChange={(e) => handleInputChange('initialAmount', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Dinheiro"
                  type="number"
                  step="0.01"
                  value={formData.cash}
                  onChange={(e) => handleInputChange('cash', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="PIX"
                  type="number"
                  step="0.01"
                  value={formData.pix}
                  onChange={(e) => handleInputChange('pix', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Cartão de Crédito"
                  type="number"
                  step="0.01"
                  value={formData.creditCard}
                  onChange={(e) => handleInputChange('creditCard', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Cartão de Débito"
                  type="number"
                  step="0.01"
                  value={formData.debitCard}
                  onChange={(e) => handleInputChange('debitCard', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Diferença:</span>
                <span className={`text-lg font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(difference)}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" icon={Save}>
                {isEdit ? 'Salvar Alterações' : 'Salvar Fechamento'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
