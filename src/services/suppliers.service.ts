import { supabase } from "@/lib/supabase";
import { Supplier, SupplierFormData } from "@/interfaces/supplier.interface";

export const SuppliersService = {
  async list() {
    const { data, error } = await supabase
      .from("fornecedores")
      .select("*")
      .order("nome");

    if (error) throw error;
    return data as Supplier[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("fornecedores")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Supplier;
  },

  async create(supplier: SupplierFormData) {
    const { data, error } = await supabase
      .from("fornecedores")
      .insert([supplier])
      .select()
      .single();

    if (error) throw error;
    return data as Supplier;
  },

  async update(id: string, supplier: SupplierFormData) {
    const { data, error } = await supabase
      .from("fornecedores")
      .update(supplier)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Supplier;
  },

  async delete(id: string) {
    const { error } = await supabase.from("fornecedores").delete().eq("id", id);

    if (error) throw error;
  },
};
