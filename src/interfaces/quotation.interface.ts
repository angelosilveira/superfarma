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
  status: "active" | "inactive";
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
  status: "draft" | "sent" | "received" | "closed";
  createdAt: string;
  updatedAt: string;
  quotations: Cotacao[];
}

export interface Cotacao {
  id: string;
  produto_id: string | null;
  nome: string;
  categoria?: string;
  preco_unitario: number;
  quantidade: number;
  unidade_medida?: string;
  preco_total: number;
  representante?: string;
  data_atualizacao: string;
  created_at: string;
  produto?: {
    id: string;
    nome: string;
    descricao?: string;
    categoria?: string;
  };
}

export interface QuotationFilters {
  search?: string;
  status?: "draft" | "sent" | "received" | "closed";
  supplierId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  preco?: number;
  estoque?: number;
  unidade_medida?: string;
  created_at?: string;
  updated_at?: string;
}
