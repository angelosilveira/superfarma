
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { Customer } from '@/interfaces/customer.interface';

export const CustomerImport: React.FC = () => {
  const navigate = useNavigate();
  const [importData, setImportData] = useState<Partial<Customer>[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulação de parsing do CSV
      const mockData = [
        {
          name: 'João Silva',
          phone: '11987654321',
          status: 'active' as const,
          outstandingBalance: 150.00
        },
        {
          name: 'Maria Santos',
          phone: '11987654322',
          status: 'active' as const,
          outstandingBalance: 0
        }
      ];
      setImportData(mockData);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome'
    },
    {
      key: 'phone',
      label: 'Contato'
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Partial<Customer>) => item.status === 'active' ? 'Ativo' : 'Inativo'
    },
    {
      key: 'outstandingBalance',
      label: 'Saldo Devedor',
      render: (item: Partial<Customer>) => formatCurrency(item.outstandingBalance || 0)
    }
  ];

  const handleImport = () => {
    console.log('Importing customers:', importData);
    navigate('/customers');
  };

  const downloadTemplate = () => {
    const csvContent = "Nome,Contato,Status,Saldo Devedor\nJoão Silva,11987654321,active,150.00\nMaria Santos,11987654322,active,0";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_clientes.csv';
    a.click();
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/customers')}>
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">Importar Clientes</h1>
            <p className="text-body text-gray-600">Importe clientes através de arquivo CSV</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Arquivo CSV</h3>
            <Button variant="outline" icon={Download} onClick={downloadTemplate}>
              Baixar Template
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Clique para selecionar um arquivo CSV ou arraste aqui
              </p>
              {file && (
                <p className="mt-2 text-sm text-green-600">
                  Arquivo selecionado: {file.name}
                </p>
              )}
            </label>
          </div>

          {importData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Visualização dos Dados</h3>
              <DataTable
                data={importData}
                columns={columns}
              />
              <div className="flex justify-end">
                <Button icon={Upload} onClick={handleImport}>
                  Importar {importData.length} Cliente(s)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
