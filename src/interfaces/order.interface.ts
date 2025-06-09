
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate?: string;
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

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'credit' | 'debit' | 'pix' | 'insurance';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  notes?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  prescriptionRequired: boolean;
  prescriptionAttached: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialOrder {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  specifications: string;
  quantity: number;
  estimatedPrice?: number;
  supplierId?: string;
  supplierName?: string;
  status: 'requested' | 'quoted' | 'ordered' | 'received' | 'delivered' | 'cancelled';
  requestDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
