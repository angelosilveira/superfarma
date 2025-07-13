// interfaces/clients-without-register.interface.ts

export interface PurchaseItem {
  id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ClientWithoutRegister {
  id: string;
  client_name: string;
  purchase_date: string;
  total_amount: number;
  observations?: string;
  purchase_items: PurchaseItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateClientWithoutRegister {
  client_name: string;
  purchase_date: string;
  total_amount: number;
  observations?: string;
  purchase_items: Omit<PurchaseItem, "id">[];
}

export interface UpdateClientWithoutRegister {
  client_name?: string;
  purchase_date?: string;
  total_amount?: number;
  observations?: string;
  purchase_items?: Omit<PurchaseItem, "id">[];
}

export interface ClientsWithoutRegisterFilters {
  client_name?: string;
  purchase_date?: string;
  start_date?: string;
  end_date?: string;
}

export interface ClientsWithoutRegisterListResponse {
  data: ClientWithoutRegister[];
  total: number;
  page: number;
  limit: number;
}

// Tipos para formulários
export interface PurchaseItemForm {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ClientWithoutRegisterForm {
  client_name: string;
  purchase_date: string;
  observations: string;
  purchase_items: PurchaseItemForm[];
  total_amount: number;
}
