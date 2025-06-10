import { Database } from "@/types/database.types";

export type CashRegister =
  Database["public"]["Tables"]["fechamentos_caixa"]["Row"];
export type CashRegisterFormData = Omit<
  Database["public"]["Tables"]["fechamentos_caixa"]["Insert"],
  "id" | "created_at" | "updated_at" | "total" | "diferenca"
>;
