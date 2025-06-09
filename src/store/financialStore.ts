
import { create } from 'zustand';
import { Sale, CashRegister, FinancialReport } from '@/interfaces/financial.interface';

interface FinancialState {
  sales: Sale[];
  cashRegisters: CashRegister[];
  currentCashRegister: CashRegister | null;
  reports: FinancialReport[];
  loading: boolean;
  error: string | null;
}

interface FinancialActions {
  setSales: (sales: Sale[]) => void;
  setCashRegisters: (cashRegisters: CashRegister[]) => void;
  setCurrentCashRegister: (cashRegister: CashRegister | null) => void;
  setReports: (reports: FinancialReport[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addSale: (sale: Sale) => void;
  openCashRegister: (cashRegister: CashRegister) => void;
  closeCashRegister: (id: string, finalAmount: number) => void;
  generateReport: (startDate: string, endDate: string) => FinancialReport;
}

type FinancialStore = FinancialState & FinancialActions;

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  sales: [],
  cashRegisters: [],
  currentCashRegister: null,
  reports: [],
  loading: false,
  error: null,

  setSales: (sales) => set({ sales }),
  setCashRegisters: (cashRegisters) => set({ cashRegisters }),
  setCurrentCashRegister: (cashRegister) => set({ currentCashRegister: cashRegister }),
  setReports: (reports) => set({ reports }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addSale: (sale) => {
    const { sales } = get();
    set({ sales: [...sales, sale] });
  },

  openCashRegister: (cashRegister) => {
    const { cashRegisters } = get();
    set({ 
      cashRegisters: [...cashRegisters, cashRegister],
      currentCashRegister: cashRegister
    });
  },

  closeCashRegister: (id, finalAmount) => {
    const { cashRegisters } = get();
    const updatedCashRegisters = cashRegisters.map(cr =>
      cr.id === id
        ? { ...cr, finalAmount, closingDate: new Date().toISOString(), status: 'closed' as const }
        : cr
    );
    set({ 
      cashRegisters: updatedCashRegisters,
      currentCashRegister: null
    });
  },

  generateReport: (startDate, endDate) => {
    const { sales } = get();
    const filteredSales = sales.filter(sale => 
      sale.date >= startDate && sale.date <= endDate
    );

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const salesByPaymentMethod = filteredSales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
      return acc;
    }, {} as Record<string, number>);

    const report: FinancialReport = {
      period: { start: startDate, end: endDate },
      totalSales,
      totalExpenses: 0, // Placeholder
      netProfit: totalSales, // Simplified calculation
      salesByPaymentMethod: {
        cash: salesByPaymentMethod.cash || 0,
        credit: salesByPaymentMethod.credit || 0,
        debit: salesByPaymentMethod.debit || 0,
        pix: salesByPaymentMethod.pix || 0,
        insurance: salesByPaymentMethod.insurance || 0,
      },
      salesByCategory: [], // Placeholder
      topProducts: [], // Placeholder
    };

    return report;
  },
}));
