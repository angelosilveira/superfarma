
import { create } from 'zustand';
import { QuotationRequest, Quotation, Supplier, QuotationFilters } from '@/interfaces/quotation.interface';

interface QuotationState {
  quotationRequests: QuotationRequest[];
  filteredQuotationRequests: QuotationRequest[];
  suppliers: Supplier[];
  filters: QuotationFilters;
  loading: boolean;
  error: string | null;
  selectedQuotationRequest: QuotationRequest | null;
}

interface QuotationActions {
  setQuotationRequests: (quotationRequests: QuotationRequest[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setFilters: (filters: QuotationFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedQuotationRequest: (quotationRequest: QuotationRequest | null) => void;
  addQuotationRequest: (quotationRequest: QuotationRequest) => void;
  updateQuotationRequest: (id: string, quotationRequest: Partial<QuotationRequest>) => void;
  deleteQuotationRequest: (id: string) => void;
  addQuotation: (quotationRequestId: string, quotation: Quotation) => void;
  updateQuotation: (quotationRequestId: string, quotationId: string, quotation: Partial<Quotation>) => void;
  markQuotationAsWinner: (quotationRequestId: string, quotationId: string) => void;
  filterQuotationRequests: () => void;
}

type QuotationStore = QuotationState & QuotationActions;

export const useQuotationStore = create<QuotationStore>((set, get) => ({
  quotationRequests: [],
  filteredQuotationRequests: [],
  suppliers: [],
  filters: {},
  loading: false,
  error: null,
  selectedQuotationRequest: null,

  setQuotationRequests: (quotationRequests) => {
    set({ quotationRequests, filteredQuotationRequests: quotationRequests });
  },

  setSuppliers: (suppliers) => set({ suppliers }),

  setFilters: (filters) => {
    set({ filters });
    get().filterQuotationRequests();
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSelectedQuotationRequest: (quotationRequest) => set({ selectedQuotationRequest: quotationRequest }),

  addQuotationRequest: (quotationRequest) => {
    const { quotationRequests } = get();
    const newQuotationRequests = [...quotationRequests, quotationRequest];
    set({ quotationRequests: newQuotationRequests });
    get().filterQuotationRequests();
  },

  updateQuotationRequest: (id, updatedQuotationRequest) => {
    const { quotationRequests } = get();
    const newQuotationRequests = quotationRequests.map(qr =>
      qr.id === id ? { ...qr, ...updatedQuotationRequest } : qr
    );
    set({ quotationRequests: newQuotationRequests });
    get().filterQuotationRequests();
  },

  deleteQuotationRequest: (id) => {
    const { quotationRequests } = get();
    const newQuotationRequests = quotationRequests.filter(qr => qr.id !== id);
    set({ quotationRequests: newQuotationRequests });
    get().filterQuotationRequests();
  },

  addQuotation: (quotationRequestId, quotation) => {
    const { quotationRequests } = get();
    const newQuotationRequests = quotationRequests.map(qr =>
      qr.id === quotationRequestId
        ? { ...qr, quotations: [...qr.quotations, quotation] }
        : qr
    );
    set({ quotationRequests: newQuotationRequests });
    get().filterQuotationRequests();
  },

  updateQuotation: (quotationRequestId, quotationId, updatedQuotation) => {
    const { quotationRequests } = get();
    const newQuotationRequests = quotationRequests.map(qr =>
      qr.id === quotationRequestId
        ? {
            ...qr,
            quotations: qr.quotations.map(q =>
              q.id === quotationId ? { ...q, ...updatedQuotation } : q
            )
          }
        : qr
    );
    set({ quotationRequests: newQuotationRequests });
    get().filterQuotationRequests();
  },

  markQuotationAsWinner: (quotationRequestId, quotationId) => {
    const { quotationRequests } = get();
    const newQuotationRequests = quotationRequests.map(qr =>
      qr.id === quotationRequestId
        ? {
            ...qr,
            quotations: qr.quotations.map(q => ({
              ...q,
              isWinner: q.id === quotationId
            }))
          }
        : qr
    );
    set({ quotationRequests: newQuotationRequests });
    get().filterQuotationRequests();
  },

  filterQuotationRequests: () => {
    const { quotationRequests, filters } = get();
    let filtered = [...quotationRequests];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(qr =>
        qr.productName.toLowerCase().includes(searchLower) ||
        qr.specifications?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(qr => qr.status === filters.status);
    }

    if (filters.supplierId) {
      filtered = filtered.filter(qr =>
        qr.quotations.some(q => q.supplierId === filters.supplierId)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(qr => qr.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(qr => qr.createdAt <= filters.dateTo!);
    }

    set({ filteredQuotationRequests: filtered });
  },
}));
