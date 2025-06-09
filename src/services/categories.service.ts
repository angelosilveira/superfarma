import { supabase } from "@/lib/supabase";
import { Category } from "@/interfaces/category.interface";

export const CategoriesService = {
  async list() {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nome");

    if (error) throw error;
    return data as Category[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Category;
  },

  async create(category: Omit<Category, "id" | "createdAt" | "updatedAt">) {
    const { data, error } = await supabase
      .from("categorias")
      .insert([
        {
          nome: category.name,
          descricao: category.description,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async update(
    id: string,
    category: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
  ) {
    const { data, error } = await supabase
      .from("categorias")
      .update({
        nome: category.name,
        descricao: category.description,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async delete(id: string) {
    const { error } = await supabase.from("categorias").delete().eq("id", id);

    if (error) throw error;
  },
};
