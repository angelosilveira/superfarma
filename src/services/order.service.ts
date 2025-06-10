import { supabase } from "@/lib/supabase";
import {
  CreateOrderData,
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/interfaces/order.interface";

export class OrderService {
  static async getAll(): Promise<Order[]> {
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
    return orders;
  }

  static async getById(id: string): Promise<Order> {
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
    return order;
  }

  static async create(data: CreateOrderData): Promise<Order> {
    // Primeiro, crie o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer: data.customer,
        customer_phone: data.customer_phone,
        delivery_date: data.delivery_date,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        delivery_notes: data.delivery_notes,
        observations: data.observations,
        status: OrderStatus.PENDING,
        payment_status:
          data.paid_amount > 0 ? PaymentStatus.PARTIAL : PaymentStatus.PENDING,
        paid_amount: data.paid_amount,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Depois, crie os itens do pedido
    if (data.items && data.items.length > 0) {
      const orderItems = data.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return this.getById(order.id);
  }

  static async update(
    id: string,
    data: Partial<CreateOrderData>
  ): Promise<Order> {
    const { items, ...orderData } = data;
    
    // Update order first
    const { error: orderError } = await supabase
      .from("orders")
      .update(orderData)
      .eq("id", id);

    if (orderError) throw orderError;

    if (items) {
      // Update items
      const { error: deleteError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", id);

      if (deleteError) throw deleteError;

      const orderItems = items.map((item) => ({
        order_id: id,
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return this.getById(id);
  }

  static async delete(id: string): Promise<void> {
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
  }

  static async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return this.getById(id);
  }

  static formatWhatsAppMessage(order: Order): string {
    const status = {
      [OrderStatus.PENDING]: "pendente",
      [OrderStatus.PROCESSING]: "em processamento",
      [OrderStatus.DELIVERED]: "entregue",
      [OrderStatus.CANCELLED]: "cancelado",
    }[order.status];
    let message = `Olá ${order.customer}! 👋\n\n`;
    message += `Seu pedido está ${status}.\n`;

    if (order.remaining_amount > 0) {
      const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(order.remaining_amount);

      message += `\nValor restante a ser pago: ${formattedAmount}`;
    }

    return encodeURIComponent(message);
  }
}
