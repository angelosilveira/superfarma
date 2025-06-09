export interface Supplier {
  id: string;
  nome: string;
  empresa: string;
  contato?: string;
  email?: string;
  created_at: string;
}

export interface SupplierFormData {
  nome: string;
  empresa: string;
  contato?: string;
  email?: string;
}
