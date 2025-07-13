export enum WishlistStatus {
  PENDING = "pending",
  ORDERED = "ordered",
  RECEIVED = "received",
  OUT_OF_STOCK = "out_of_stock",
}

export interface WishlistItem {
  id: string;
  product_name: string;
  observations?: string;
  customer_name?: string;
  quantity: number | null;
  status: WishlistStatus;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWishlistItem {
  product_name: string;
  observations?: string;
  customer_name?: string;
  quantity: number | null;
  status?: WishlistStatus;
  category: string;
}

export interface UpdateWishlistItem {
  product_name?: string;
  observations?: string;
  customer_name?: string;
  quantity?: number | null;
  status?: WishlistStatus;
  category?: string;
}
