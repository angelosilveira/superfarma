
import { create } from 'zustand';
import { Order, SpecialOrder, Customer } from '@/interfaces/order.interface';

interface OrderState {
  orders: Order[];
  specialOrders: SpecialOrder[];
  customers: Customer[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  selectedSpecialOrder: SpecialOrder | null;
}

interface OrderActions {
  setOrders: (orders: Order[]) => void;
  setSpecialOrders: (specialOrders: SpecialOrder[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setSelectedSpecialOrder: (specialOrder: SpecialOrder | null) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addSpecialOrder: (specialOrder: SpecialOrder) => void;
  updateSpecialOrder: (id: string, specialOrder: Partial<SpecialOrder>) => void;
  deleteSpecialOrder: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
}

type OrderStore = OrderState & OrderActions;

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  specialOrders: [],
  customers: [],
  loading: false,
  error: null,
  selectedOrder: null,
  selectedSpecialOrder: null,

  setOrders: (orders) => set({ orders }),
  setSpecialOrders: (specialOrders) => set({ specialOrders }),
  setCustomers: (customers) => set({ customers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setSelectedSpecialOrder: (specialOrder) => set({ selectedSpecialOrder: specialOrder }),

  addOrder: (order) => {
    const { orders } = get();
    set({ orders: [...orders, order] });
  },

  updateOrder: (id, updatedOrder) => {
    const { orders } = get();
    const newOrders = orders.map(order =>
      order.id === id ? { ...order, ...updatedOrder } : order
    );
    set({ orders: newOrders });
  },

  deleteOrder: (id) => {
    const { orders } = get();
    const newOrders = orders.filter(order => order.id !== id);
    set({ orders: newOrders });
  },

  addSpecialOrder: (specialOrder) => {
    const { specialOrders } = get();
    set({ specialOrders: [...specialOrders, specialOrder] });
  },

  updateSpecialOrder: (id, updatedSpecialOrder) => {
    const { specialOrders } = get();
    const newSpecialOrders = specialOrders.map(so =>
      so.id === id ? { ...so, ...updatedSpecialOrder } : so
    );
    set({ specialOrders: newSpecialOrders });
  },

  deleteSpecialOrder: (id) => {
    const { specialOrders } = get();
    const newSpecialOrders = specialOrders.filter(so => so.id !== id);
    set({ specialOrders: newSpecialOrders });
  },

  addCustomer: (customer) => {
    const { customers } = get();
    set({ customers: [...customers, customer] });
  },

  updateCustomer: (id, updatedCustomer) => {
    const { customers } = get();
    const newCustomers = customers.map(customer =>
      customer.id === id ? { ...customer, ...updatedCustomer } : customer
    );
    set({ customers: newCustomers });
  },
}));
