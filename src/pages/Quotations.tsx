
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { DataTable } from '@/components/organisms/DataTable';
import { SearchInput } from '@/components/molecules/SearchInput';
import { StatusBadge } from '@/components/molecules/StatusBadge';
import { WhatsAppButton } from '@/components/molecules/WhatsAppButton';
import { Button } from '@/components/atoms/Button';
import { useQuotationStore } from '@/store/quotationStore';
import { QuotationRequest, Quotation } from '@/interfaces/quotation.interface';
import { formatCurrency, formatDate } from '@/utils/formatters';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: '📊',
  },
  {
    id: 'products',
    label: 'Produtos',
    path: '/products',
    icon: '💊',
  },
  {
    id: 'quotations',
    label: 'Cotações',
    path: '/quotations',
    icon: '📋',
  },
  {
    id: 'orders',
    label: 'Pedidos',
    path: '/orders',
    icon: '🛒',
  },
  {
    id: 'special-orders',
    label: 'Encomendas',
    path: '/special-orders',
    icon: '📦',
  },
  {
    id: 'customers',
    label: 'Clientes',
    path: '/customers',
    icon: '👥',
  },
  {
    id: 'financial',
    label: 'Financeiro',
    path: '/financial',
    icon: '💰',
  },
  {
    id: 'reports',
    label: 'Relatórios',
    path: '/reports',
    icon: '📈',
  },
];

// Mock data
const mockQuotationRequests: QuotationRequest[] = [
  {
    id: '1',
    productId: 'prod1',
    productName: 'Dipirona 500mg',
    quantity: 100,
    unit: 'cx',
    specifications: 'Genérico, validade mínima 12 meses',
    deadlineDate: '2024-01-15',
    status: 'received',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
    quotations: [
      {
        id: 'q1',
        quotationRequestId: '1',
        supplierId: 's1',
        supplierName: 'Farmácia Distribuidora ABC',
        unitPrice: 12.50,
        totalPrice: 1250.00,
        deliveryDays: 5,
        paymentTerms: '30 dias',
        isWinner: true,
        status: 'accepted',
        validUntil: '2024-01-20',
        createdAt: '2024-01-11',
        updatedAt: '2024-01-12',
      },
      {
        id: 'q2',
        quotationRequestId: '1',
        supplierId: 's2',
        supplierName: 'Distribuidora XYZ',
        unitPrice: 13.00,
        totalPrice: 1300.00,
        deliveryDays: 7,
        paymentTerms: '45 dias',
        isWinner: false,
        status: 'pending',
        validUntil: '2024-01-18',
        createdAt: '2024-01-11',
        updatedAt: '2024-01-11',
      }
    ]
  },
  {
    id: '2',
    productId: 'prod2',
    productName: 'Amoxicilina 500mg',
    quantity: 50,
    unit: 'cx',
    deadlineDate: '2024-01-20',
    status: 'sent',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    quotations: []
  }
];

const mockSuppliers = [
  {
    id: 's1',
    name: 'Farmácia Distribuidora ABC',
    whatsapp: '11987654321'
  },
  {
    id: 's2',
    name: 'Distribuidora XYZ',
    whatsapp: '11876543210'
  }
];

export const Quotations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotationRequest, setSelectedQuotationRequest] = useState<QuotationRequest | null>(null);

  const quotationRequestColumns = [
    {
      key: 'productName',
      label: 'Produto',
      sortable: true,
    },
    {
      key: 'quantity',
      label: 'Quantidade',
      render: (item: QuotationRequest) => `${item.quantity} ${item.unit}`,
    },
    {
      key: 'deadlineDate',
      label: 'Prazo',
      render: (item: QuotationRequest) => formatDate(item.deadlineDate),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: QuotationRequest) => <StatusBadge status={item.status} />,
    },
    {
      key: 'quotations',
      label: 'Cotações',
      render: (item: QuotationRequest) => `${item.quotations.length} recebidas`,
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (item: QuotationRequest) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setSelectedQuotationRequest(item)}
          >
            Ver Detalhes
          </Button>
        </div>
      ),
    },
  ];

  const quotationColumns = [
    {
      key: 'supplierName',
      label: 'Fornecedor',
      sortable: true,
    },
    {
      key: 'unitPrice',
      label: 'Preço Unitário',
      render: (item: Quotation) => formatCurrency(item.unitPrice),
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: (item: Quotation) => formatCurrency(item.totalPrice),
    },
    {
      key: 'deliveryDays',
      label: 'Prazo Entrega',
      render: (item: Quotation) => `${item.deliveryDays} dias`,
    },
    {
      key: 'paymentTerms',
      label: 'Pagamento',
    },
    {
      key: 'isWinner',
      label: 'Status',
      render: (item: Quotation) => (
        <div className="flex items-center gap-2">
          {item.isWinner && <StatusBadge status="winner" statusMap={{ winner: { variant: 'success', label: 'Vencedor' } }} />}
          <StatusBadge status={item.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'WhatsApp',
      render: (item: Quotation) => {
        const supplier = mockSuppliers.find(s => s.id === item.supplierId);
        if (!supplier?.whatsapp) return null;
        
        const message = `Olá! Gostaria de confirmar a cotação do produto ${selectedQuotationRequest?.productName} - Quantidade: ${selectedQuotationRequest?.quantity} ${selectedQuotationRequest?.unit} - Valor: ${formatCurrency(item.totalPrice)}`;
        
        return (
          <WhatsAppButton
            phoneNumber={supplier.whatsapp}
            message={message}
          />
        );
      },
    },
  ];

  const filteredQuotationRequests = mockQuotationRequests.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.specifications?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-title text-foreground mb-2">Cotações</h1>
            <p className="text-body text-muted-foreground">
              Gerencie suas solicitações de cotação e fornecedores
            </p>
          </div>
          <Button variant="primary">
            Nova Cotação
          </Button>
        </div>

        {!selectedQuotationRequest ? (
          <>
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por produto, descrição ou especificações..."
                />
              </div>
            </div>

            {/* Quotation Requests Table */}
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border">
                <h3 className="text-subtitle font-semibold">Solicitações de Cotação</h3>
              </div>
              <DataTable
                data={filteredQuotationRequests}
                columns={quotationRequestColumns}
              />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setSelectedQuotationRequest(null)}
            >
              ← Voltar às Cotações
            </Button>

            {/* Quotation Request Details */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-subtitle font-semibold mb-4">
                Detalhes da Cotação - {selectedQuotationRequest.productName}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-label text-muted-foreground">Quantidade</p>
                  <p className="text-body">{selectedQuotationRequest.quantity} {selectedQuotationRequest.unit}</p>
                </div>
                <div>
                  <p className="text-label text-muted-foreground">Prazo</p>
                  <p className="text-body">{formatDate(selectedQuotationRequest.deadlineDate)}</p>
                </div>
                <div>
                  <p className="text-label text-muted-foreground">Status</p>
                  <StatusBadge status={selectedQuotationRequest.status} />
                </div>
              </div>

              {selectedQuotationRequest.specifications && (
                <div className="mb-6">
                  <p className="text-label text-muted-foreground">Especificações</p>
                  <p className="text-body">{selectedQuotationRequest.specifications}</p>
                </div>
              )}
            </div>

            {/* Quotations Table */}
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border">
                <h3 className="text-subtitle font-semibold">Cotações Recebidas</h3>
              </div>
              
              {selectedQuotationRequest.quotations.length > 0 ? (
                <DataTable
                  data={selectedQuotationRequest.quotations}
                  columns={quotationColumns}
                />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  Nenhuma cotação recebida ainda
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
