
import { Product, ProductFilters } from '@/interfaces/product.interface';

// Mock data - In a real app, this would come from Supabase
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dipirona 500mg',
    description: 'Analgésico e antitérmico',
    sku: 'DIP500',
    barcode: '7891234567890',
    category: 'Analgésicos',
    manufacturer: 'EMS',
    price: 15.90,
    cost: 8.50,
    stock: 150,
    minimumStock: 20,
    unit: 'cx',
    tags: ['analgésico', 'antitérmico', 'dipirona'],
    status: 'active',
    requiresPrescription: false,
    controlledSubstance: false,
    expirationDate: '2025-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Amoxicilina 500mg',
    description: 'Antibiótico de amplo espectro',
    sku: 'AMX500',
    category: 'Antibióticos',
    manufacturer: 'Medley',
    price: 25.50,
    cost: 12.00,
    stock: 8,
    minimumStock: 15,
    unit: 'cx',
    tags: ['antibiótico', 'amoxicilina', 'infecção'],
    status: 'active',
    requiresPrescription: true,
    controlledSubstance: false,
    expirationDate: '2025-08-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  }
];

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockProducts];
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters?.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    
    if (filters?.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }
    
    if (filters?.requiresPrescription !== undefined) {
      filtered = filtered.filter(product => product.requiresPrescription === filters.requiresPrescription);
    }
    
    if (filters?.lowStock) {
      filtered = filtered.filter(product => product.stock <= product.minimumStock);
    }
    
    return filtered;
  }

  async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.find(product => product.id === id) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockProducts.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    mockProducts[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts.splice(productIndex, 1);
  }

  async getCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = [...new Set(mockProducts.map(product => product.category))];
    return categories.sort();
  }
}

export const productService = new ProductService();
