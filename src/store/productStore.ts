
import { create } from 'zustand';
import { Product, ProductFilters } from '@/interfaces/product.interface';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  setFilters: (filters: ProductFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  filterProducts: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  filters: {},
  loading: false,
  error: null,
  selectedProduct: null,

  setProducts: (products) => {
    set({ products, filteredProducts: products });
  },

  setFilters: (filters) => {
    set({ filters });
    get().filterProducts();
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  addProduct: (product) => {
    const { products } = get();
    const newProducts = [...products, product];
    set({ products: newProducts });
    get().filterProducts();
  },

  updateProduct: (id, updatedProduct) => {
    const { products } = get();
    const newProducts = products.map(product =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    set({ products: newProducts });
    get().filterProducts();
  },

  deleteProduct: (id) => {
    const { products } = get();
    const newProducts = products.filter(product => product.id !== id);
    set({ products: newProducts });
    get().filterProducts();
  },

  filterProducts: () => {
    const { products, filters } = get();
    let filtered = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    if (filters.requiresPrescription !== undefined) {
      filtered = filtered.filter(product => product.requiresPrescription === filters.requiresPrescription);
    }

    if (filters.lowStock) {
      filtered = filtered.filter(product => product.stock <= product.minimumStock);
    }

    set({ filteredProducts: filtered });
  },
}));
