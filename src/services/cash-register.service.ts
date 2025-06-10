import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

const TABLE_NAME = "fechamentos_caixa";
type Row = Database["public"]["Tables"]["fechamentos_caixa"]["Row"];
type Insert = Database["public"]["Tables"]["fechamentos_caixa"]["Insert"];
type Update = Database["public"]["Tables"]["fechamentos_caixa"]["Update"];

export const CashRegisterService = {
  async getAll(): Promise<Row[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("data_fechamento", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Row> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Record not found");
    return data;
  },

  async create(formData: Insert): Promise<Row> {
    const total =
      (formData.dinheiro || 0) +
      (formData.pix || 0) +
      (formData.cartao_credito || 0) +
      (formData.cartao_debito || 0);
    const diferenca = total - (formData.valor_inicial || 0);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        ...formData,
        total,
        diferenca,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to create record");
    return data;
  },

  async update(id: string, formData: Update): Promise<Row> {
    const total =
      (formData.dinheiro || 0) +
      (formData.pix || 0) +
      (formData.cartao_credito || 0) +
      (formData.cartao_debito || 0);
    const diferenca = total - (formData.valor_inicial || 0);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...formData,
        total,
        diferenca,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Record not found");
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) throw error;
  },
};
