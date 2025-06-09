
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: string;
  manufacturer: string;
  price: number;
  cost: number;
  stock: number;
  minimumStock: number;
  unit: string;
  tags: string[];
  status: 'active' | 'inactive' | 'discontinued';
  requiresPrescription: boolean;
  controlledSubstance: boolean;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  requiresPrescription?: boolean;
  lowStock?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: string;
  manufacturer: string;
  price: number;
  cost: number;
  stock: number;
  minimumStock: number;
  unit: string;
  tags: string[];
  requiresPrescription: boolean;
  controlledSubstance: boolean;
  expirationDate?: string;
}
