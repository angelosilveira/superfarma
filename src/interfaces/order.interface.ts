export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIAL = "partial",
  CANCELLED = "cancelled",
}

export enum OrderCategory {
  MEDICAMENTO = "MEDICAMENTO",
  GENERICO = "GENERICO",
  SIMILAR = "SIMILAR",
  PERFUMARIA = "PERFUMARIA",
  OUTROS = "OUTROS",
}

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
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer: string;
  customer_phone: string;
  category: OrderCategory;
  order_cost: number;
  paid_amount: number;
  remaining_amount: number;
  delivery_date: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  delivery_notes?: string;
  observations?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
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
  status:
    | "requested"
    | "quoted"
    | "ordered"
    | "received"
    | "delivered"
    | "cancelled";
  requestDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderData {
  customer: string;
  customer_phone: string;
  category: OrderCategory;
  order_cost: number;
  paid_amount: number;
  delivery_date: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  delivery_notes?: string;
  observations?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}
