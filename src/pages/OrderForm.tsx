import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronsUpDown,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import {
  CreateOrderData,
  OrderStatus,
  OrderCategory,
} from "@/interfaces/order.interface";
import { OrderService } from "@/services/order.service";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total: number;
}

export const OrderForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState<Partial<CreateOrderData>>({
    customer: "",
    customer_phone: "",
    category: OrderCategory.MEDICAMENTO,
    order_cost: 0,
    paid_amount: 0,
    delivery_date: new Date().toISOString().split("T")[0],
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    delivery_notes: "",
    observations: "",
    items: [],
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);

  const [openCustomer, setOpenCustomer] = useState(false);
  const [openProduct, setOpenProduct] = useState<number[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const order = await OrderService.getById(id);

      setFormData({
        customer: order.customer,
        customer_phone: order.customer_phone,
        category: order.category,
        order_cost: order.order_cost,
        paid_amount: order.paid_amount,
        delivery_date: order.delivery_date,
        street: order.street,
        number: order.number,
        complement: order.complement,
        neighborhood: order.neighborhood,
        city: order.city,
        state: order.state,
        delivery_notes: order.delivery_notes,
        observations: order.observations,
      });

      const orderItems = order.items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total: item.unit_price * item.quantity,
      }));

      setItems(orderItems);
    } catch (error) {
      toast({
        title: "Erro ao carregar pedido",
        description: "Não foi possível carregar os dados do pedido.",
        variant: "destructive",
      });
      navigate("/orders");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    Promise.all([loadOrder()]).catch((error) => {
      console.error("Error loading data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar os dados necessários.",
        variant: "destructive",
      });
    });
  }, [loadOrder]);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.total, 0);
    setTotal(newTotal);
  }, [items]);

  const handleInputChange = (
    field: keyof CreateOrderData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ["paid_amount", "order_cost"].includes(field)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product_id: "",
        product_name: "",
        unit_price: 0,
        quantity: 1,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setItems((prev) => {
      const newItems = [...prev];
      const item = { ...newItems[index] };

      if (field === "quantity" || field === "unit_price") {
        item[field] = Number(value) || 0;
        item.total = item.quantity * item.unit_price;
      } else {
        item[field] = value;
      }

      newItems[index] = item;
      return newItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o nome do cliente.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Itens obrigatórios",
        description: "Adicione pelo menos um item ao pedido.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const orderData: CreateOrderData = {
        customer: formData.customer || "",
        customer_phone: formData.customer_phone || "",
        category: formData.category || OrderCategory.MEDICAMENTO,
        order_cost: formData.order_cost || 0,
        paid_amount: formData.paid_amount || 0,
        delivery_date:
          formData.delivery_date || new Date().toISOString().split("T")[0],
        street: formData.street || "",
        number: formData.number || "",
        complement: formData.complement,
        neighborhood: formData.neighborhood || "",
        city: formData.city || "",
        state: formData.state || "",
        delivery_notes: formData.delivery_notes,
        observations: formData.observations,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      if (isEdit) {
        await OrderService.update(id!, orderData);
        toast({
          title: "Pedido atualizado",
          description: "O pedido foi atualizado com sucesso.",
        });
      } else {
        await OrderService.create(orderData);
        toast({
          title: "Pedido criado",
          description: "O pedido foi criado com sucesso.",
        });
      }
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o pedido.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate("/orders")}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit ? "Editar Pedido" : "Novo Pedido"}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit ? "Edite os dados do pedido" : "Registre um novo pedido"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Nome do Cliente *
                </label>
                <Input
                  value={formData.customer}
                  onChange={(e) =>
                    handleInputChange("customer", e.target.value)
                  }
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Telefone do Cliente
                </label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) =>
                    handleInputChange("customer_phone", e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                  type="tel"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Categoria do Pedido *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange(
                      "category",
                      e.target.value as OrderCategory
                    )
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  {Object.values(OrderCategory).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Data de Entrega *
                </label>
                <Input
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) =>
                    handleInputChange("delivery_date", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Custo do Pedido (R$)
                </label>
                <Input
                  type="number"
                  value={formData.order_cost}
                  onChange={(e) =>
                    handleInputChange("order_cost", Number(e.target.value))
                  }
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Valor de Entrada (R$)
                </label>
                <Input
                  type="number"
                  value={formData.paid_amount}
                  onChange={(e) =>
                    handleInputChange("paid_amount", Number(e.target.value))
                  }
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Valor Restante (R$)
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {formatCurrency(total - (formData.paid_amount || 0))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Rua *</label>
                <Input
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Número</label>
                  <Input
                    value={formData.number}
                    onChange={(e) =>
                      handleInputChange("number", e.target.value)
                    }
                    placeholder="Número"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">
                    Complemento
                  </label>
                  <Input
                    value={formData.complement}
                    onChange={(e) =>
                      handleInputChange("complement", e.target.value)
                    }
                    placeholder="Apto, Sala, etc."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Bairro *</label>
                <Input
                  value={formData.neighborhood}
                  onChange={(e) =>
                    handleInputChange("neighborhood", e.target.value)
                  }
                  placeholder="Nome do bairro"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Cidade *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Nome da cidade"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Estado *</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="UF"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Itens do Pedido</h2>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-start"
                  >
                    <div className="col-span-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium">
                          Produto *
                        </label>
                        <div className="space-y-2">
                          <Input
                            value={item.product_name}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "product_name",
                                e.target.value
                              )
                            }
                            placeholder="Nome do produto"
                            required
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "unit_price",
                                  Number(e.target.value)
                                )
                              }
                              placeholder="Preço unitário"
                              step="0.01"
                              min="0"
                              required
                            />
                            <Input
                              type="text"
                              value={item.product_id}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "product_id",
                                  e.target.value
                                )
                              }
                              placeholder="Código do produto"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium">
                          Quantidade *
                        </label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Preço Un.</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                          {formatCurrency(item.unit_price)}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Subtotal</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 pt-7">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end text-lg font-medium">
                <span>Total: {formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Observações</label>
              <Textarea
                value={formData.observations}
                onChange={(e) =>
                  handleInputChange("observations", e.target.value)
                }
                rows={4}
                placeholder="Observações adicionais sobre o pedido..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Instruções de Entrega
              </label>
              <Textarea
                value={formData.delivery_notes}
                onChange={(e) =>
                  handleInputChange("delivery_notes", e.target.value)
                }
                rows={2}
                placeholder="Instruções para entrega do pedido..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => navigate("/orders")}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEdit ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
