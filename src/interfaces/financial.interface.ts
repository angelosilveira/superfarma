
export interface Sale {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  total: number;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'pix' | 'insurance';
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface CashRegister {
  id: string;
  userId: string;
  userName: string;
  openingDate: string;
  closingDate?: string;
  initialAmount: number;
  finalAmount?: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalPix: number;
  status: 'open' | 'closed';
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'adjustment';
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'pix';
  date: string;
  orderId?: string;
}

export interface FinancialReport {
  period: {
    start: string;
    end: string;
  };
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  salesByPaymentMethod: {
    cash: number;
    credit: number;
    debit: number;
    pix: number;
    insurance: number;
  };
  salesByCategory: {
    category: string;
    amount: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
}
