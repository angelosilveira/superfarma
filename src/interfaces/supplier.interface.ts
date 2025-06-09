
export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  cnpj?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  cnpj?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
