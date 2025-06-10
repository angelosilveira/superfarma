import { supabase } from "@/lib/supabase";
import {
  CreateOrderData,
  Order,
  OrderStatus,
} from "@/interfaces/order.interface";

export const OrderService = {
  async getAll(): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch customer details for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const { data: customer } = await supabase
          .from("customers")
          .select("name, phone")
          .eq("id", order.customer_id)
          .single();

        return {
          ...order,
          customer_name: customer?.name || "Cliente não encontrado",
          customer_phone: customer?.phone || "",
        };
      })
    );

    return ordersWithCustomers;
  },

  async getById(id: string): Promise<Order> {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!order) throw new Error("Pedido não encontrado");

    // Fetch customer details
    const { data: customer } = await supabase
      .from("customers")
      .select("name, phone")
      .eq("id", order.customer_id)
      .single();

    return {
      ...order,
      customer_name: customer?.name || "Cliente não encontrado",
      customer_phone: customer?.phone || "",
    };
  },

  async create(data: CreateOrderData): Promise<Order> {
    const { items, ...orderData } = data;

    // Calculate total amount
    const total_amount = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    // Start transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          total_amount,
          status: OrderStatus.PENDING,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return this.getById(order.id);
  },

  async update(id: string, data: Partial<CreateOrderData>): Promise<Order> {
    const { items, ...orderData } = data;

    if (items) {
      const total_amount = items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      orderData.total_amount = total_amount;

      // Update items
      const { error: deleteError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", id);

      if (deleteError) throw deleteError;

      const orderItems = items.map((item) => ({
        order_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Update order
    const { error: orderError } = await supabase
      .from("orders")
      .update(orderData)
      .eq("id", id);

    if (orderError) throw orderError;

    return this.getById(id);
  },

  async delete(id: string): Promise<void> {
    // Delete order items first (foreign key constraint)
    const { error: itemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    // Delete order
    const { error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (orderError) throw orderError;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return this.getById(id);
  },

  formatWhatsAppMessage(order: Order): string {
    const status = {
      [OrderStatus.PENDING]: "pendente",
      [OrderStatus.PROCESSING]: "em processamento",
      [OrderStatus.DELIVERED]: "entregue",
      [OrderStatus.CANCELLED]: "cancelado",
    }[order.status];

    let message = `Olá ${order.customer_name}! 👋\n\n`;
    message += `Seu pedido está ${status}.\n`;

    if (order.remaining_amount > 0) {
      const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(order.remaining_amount);

      message += `\nValor restante a ser pago: ${formattedAmount}`;
    }

    return encodeURIComponent(message);
  },
};
