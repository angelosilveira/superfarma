
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive';
  outstandingBalance: number;
  lastPurchase?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive';
  outstandingBalance: number;
}
