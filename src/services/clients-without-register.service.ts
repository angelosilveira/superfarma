// services/clients-without-register.service.ts

import { supabase } from "@/lib/supabase";
import {
  ClientWithoutRegister,
  CreateClientWithoutRegister,
  UpdateClientWithoutRegister,
  ClientsWithoutRegisterFilters,
  ClientsWithoutRegisterListResponse,
} from "@/interfaces/clients-without-register.interface";

export class ClientsWithoutRegisterService {
  private static tableName = "clients_without_register";
  private static itemsTableName = "purchase_items";

  static async list(
    filters: ClientsWithoutRegisterFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ClientsWithoutRegisterListResponse> {
    let query = supabase
      .from(this.tableName)
      .select(
        `
        *,
        purchase_items (
          id,
          product_name,
          quantity,
          unit_price,
          total_price
        )
      `
      )
      .order("created_at", { ascending: false });

    // Aplicar filtros
    if (filters.client_name) {
      query = query.ilike("client_name", `%${filters.client_name}%`);
    }

    if (filters.purchase_date) {
      query = query.eq("purchase_date", filters.purchase_date);
    }

    if (filters.start_date) {
      query = query.gte("purchase_date", filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte("purchase_date", filters.end_date);
    }

    // Paginação
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Erro ao buscar clientes sem cadastro: ${error.message}`);
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
    };
  }

  static async getById(id: string): Promise<ClientWithoutRegister> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        `
        *,
        purchase_items (
          id,
          product_name,
          quantity,
          unit_price,
          total_price
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar cliente sem cadastro: ${error.message}`);
    }

    return data;
  }

  static async create(
    client: CreateClientWithoutRegister
  ): Promise<ClientWithoutRegister> {
    const { data: clientData, error: clientError } = await supabase
      .from(this.tableName)
      .insert({
        client_name: client.client_name,
        purchase_date: client.purchase_date,
        total_amount: client.total_amount,
        observations: client.observations,
      })
      .select()
      .single();

    if (clientError) {
      throw new Error(
        `Erro ao criar cliente sem cadastro: ${clientError.message}`
      );
    }

    // Inserir itens da compra
    const purchaseItems = client.purchase_items.map((item) => ({
      ...item,
      client_without_register_id: clientData.id,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from(this.itemsTableName)
      .insert(purchaseItems)
      .select();

    if (itemsError) {
      // Se houve erro ao inserir itens, remover o cliente criado
      await supabase.from(this.tableName).delete().eq("id", clientData.id);
      throw new Error(`Erro ao criar itens da compra: ${itemsError.message}`);
    }

    return {
      ...clientData,
      purchase_items: itemsData,
    };
  }

  static async update(
    id: string,
    updates: UpdateClientWithoutRegister
  ): Promise<ClientWithoutRegister> {
    // Atualizar dados do cliente
    const { data: clientData, error: clientError } = await supabase
      .from(this.tableName)
      .update({
        client_name: updates.client_name,
        purchase_date: updates.purchase_date,
        total_amount: updates.total_amount,
        observations: updates.observations,
      })
      .eq("id", id)
      .select()
      .single();

    if (clientError) {
      throw new Error(
        `Erro ao atualizar cliente sem cadastro: ${clientError.message}`
      );
    }

    // Se há itens para atualizar, primeiro deletar os existentes
    if (updates.purchase_items) {
      const { error: deleteError } = await supabase
        .from(this.itemsTableName)
        .delete()
        .eq("client_without_register_id", id);

      if (deleteError) {
        throw new Error(
          `Erro ao deletar itens existentes: ${deleteError.message}`
        );
      }

      // Inserir novos itens
      const purchaseItems = updates.purchase_items.map((item) => ({
        ...item,
        client_without_register_id: id,
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from(this.itemsTableName)
        .insert(purchaseItems)
        .select();

      if (itemsError) {
        throw new Error(
          `Erro ao criar novos itens da compra: ${itemsError.message}`
        );
      }

      return {
        ...clientData,
        purchase_items: itemsData,
      };
    }

    // Se não há itens para atualizar, buscar os existentes
    const { data: existingItems } = await supabase
      .from(this.itemsTableName)
      .select("*")
      .eq("client_without_register_id", id);

    return {
      ...clientData,
      purchase_items: existingItems || [],
    };
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar cliente sem cadastro: ${error.message}`);
    }
  }

  static async deleteMultiple(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .in("id", ids);

    if (error) {
      throw new Error(
        `Erro ao deletar clientes sem cadastro: ${error.message}`
      );
    }
  }
}
