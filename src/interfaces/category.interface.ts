export interface Category {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
}
