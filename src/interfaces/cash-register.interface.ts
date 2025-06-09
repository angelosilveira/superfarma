
export interface CashRegister {
  id: string;
  responsible: string;
  date: string;
  totalAmount: number;
  observations?: string;
  initialAmount: number;
  cash: number;
  pix: number;
  creditCard: number;
  debitCard: number;
  total: number;
  difference: number;
  createdAt: string;
  updatedAt: string;
}

export interface CashRegisterFormData {
  responsible: string;
  date: string;
  observations?: string;
  initialAmount: number;
  cash: number;
  pix: number;
  creditCard: number;
  debitCard: number;
}
