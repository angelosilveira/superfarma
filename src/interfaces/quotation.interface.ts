
export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface QuotationRequest {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  specifications?: string;
  deadlineDate: string;
  status: 'draft' | 'sent' | 'received' | 'closed';
  createdAt: string;
  updatedAt: string;
  quotations: Quotation[];
}

export interface Quotation {
  id: string;
  quotationRequestId: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDays: number;
  paymentTerms: string;
  notes?: string;
  isWinner: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationFilters {
  search?: string;
  status?: 'draft' | 'sent' | 'received' | 'closed';
  supplierId?: string;
  dateFrom?: string;
  dateTo?: string;
}
