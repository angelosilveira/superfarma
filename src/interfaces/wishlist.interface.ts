export enum WishlistStatus {
  PENDING = "pending",
  ORDERED = "ordered",
  RECEIVED = "received",
}

export interface WishlistItem {
  id: string;
  product_name: string;
  observations?: string;
  customer_name?: string;
  quantity: number;
  status: WishlistStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateWishlistItem {
  product_name: string;
  observations?: string;
  customer_name?: string;
  quantity: number;
  status?: WishlistStatus;
}

export interface UpdateWishlistItem {
  product_name?: string;
  observations?: string;
  customer_name?: string;
  quantity?: number;
  status?: WishlistStatus;
}
