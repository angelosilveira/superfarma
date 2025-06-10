export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          cnpj: string | null;
          address: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          cnpj?: string | null;
          address?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          cnpj?: string | null;
          address?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotation_requests: {
        Row: {
          id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit: string;
          specifications: string | null;
          deadline_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit: string;
          specifications?: string | null;
          deadline_date: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit?: string;
          specifications?: string | null;
          deadline_date?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotations: {
        Row: {
          id: string;
          quotation_request_id: string;
          supplier_id: string;
          unit_price: number;
          total_price: number;
          delivery_days: number | null;
          payment_terms: string | null;
          notes: string | null;
          is_winner: boolean;
          status: string;
          valid_until: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quotation_request_id: string;
          supplier_id: string;
          unit_price: number;
          total_price: number;
          delivery_days?: number | null;
          payment_terms?: string | null;
          notes?: string | null;
          is_winner?: boolean;
          status?: string;
          valid_until: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quotation_request_id?: string;
          supplier_id?: string;
          unit_price?: number;
          total_price?: number;
          delivery_days?: number | null;
          payment_terms?: string | null;
          notes?: string | null;
          is_winner?: boolean;
          status?: string;
          valid_until?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      fechamentos_caixa: {
        Row: {
          id: string;
          responsavel: string;
          data: string;
          valor_inicial: number;
          dinheiro: number;
          pix: number;
          cartao_credito: number;
          cartao_debito: number;
          total: number;
          diferenca: number;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          responsavel: string;
          data: string;
          valor_inicial: number;
          dinheiro: number;
          pix: number;
          cartao_credito: number;
          cartao_debito: number;
          total?: number;
          diferenca?: number;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          responsavel?: string;
          data?: string;
          valor_inicial?: number;
          dinheiro?: number;
          pix?: number;
          cartao_credito?: number;
          cartao_debito?: number;
          total?: number;
          diferenca?: number;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
