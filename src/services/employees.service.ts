import { supabase } from "@/lib/supabase";
import { Employee, EmployeeFormData } from "@/interfaces/employee.interface";

export const EmployeesService = {
  async list() {
    const { data, error } = await supabase
      .from("colaboradores")
      .select("*")
      .order("nome");

    if (error) throw error;
    return data as Employee[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("colaboradores")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async create(employee: EmployeeFormData) {
    const { data, error } = await supabase
      .from("colaboradores")
      .insert([employee])
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async update(id: string, employee: EmployeeFormData) {
    const { data, error } = await supabase
      .from("colaboradores")
      .update(employee)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("colaboradores")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
