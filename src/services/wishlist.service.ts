import { supabase } from "@/lib/supabase";
import {
  WishlistItem,
  CreateWishlistItem,
  UpdateWishlistItem,
  WishlistStatus,
} from "@/interfaces/wishlist.interface";

export class WishlistService {
  private static TABLE_NAME = "wishlist_items";

  static async list(): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async create(item: CreateWishlistItem): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(
    id: string,
    item: UpdateWishlistItem
  ): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(item)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBulkStatus(
    ids: string[],
    status: WishlistStatus
  ): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update({ status })
      .in("id", ids);

    if (error) throw error;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
