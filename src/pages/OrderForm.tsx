import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/atoms/CurrencyInput";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { CreateOrderData, OrderCategory } from "@/interfaces/order.interface";
import { OrderService } from "@/services/order.service";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  product_id: string;
  product_name: string;
  category: OrderCategory;
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

  const [formData, setFormData] = useState<Partial<CreateOrderData>>({
    customer: "",
    customer_phone: "",
    delivery_date: new Date().toISOString().split("T")[0],
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    delivery_notes: "",
    observations: "",
    paid_amount: 0,
    items: [],
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const order = await OrderService.getById(id);

      setFormData({
        customer: order.customer,
        customer_phone: order.customer_phone,
        delivery_date: order.delivery_date,
        street: order.street,
        number: order.number,
        complement: order.complement,
        neighborhood: order.neighborhood,
        delivery_notes: order.delivery_notes,
        observations: order.observations,
        paid_amount: order.paid_amount,
      });

      const orderItems = order.items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
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
    loadOrder().catch(console.error);
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
      [field]: field === "paid_amount" ? Number(value) || 0 : value,
    }));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product_id: "",
        product_name: "",
        category: OrderCategory.MEDICAMENTO,
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
        delivery_date:
          formData.delivery_date || new Date().toISOString().split("T")[0],
        street: formData.street || "",
        number: formData.number || "",
        complement: formData.complement,
        neighborhood: formData.neighborhood || "",
        delivery_notes: formData.delivery_notes,
        observations: formData.observations,
        paid_amount: formData.paid_amount || 0,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          category: item.category,
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
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
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
            {/* Customer Information */}
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
            </div>

            {/* Address Information */}
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
              </div>{" "}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Bairro</label>
                <Input
                  value={formData.neighborhood}
                  onChange={(e) =>
                    handleInputChange("neighborhood", e.target.value)
                  }
                  placeholder="Nome do bairro"
                />
              </div>
            </div>

            {/* Order Items */}
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
                    className="grid grid-cols-12 gap-4 items-start bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="col-span-3">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium">
                          Produto *
                        </label>
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
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium">
                          Categoria *
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) =>
                            handleItemChange(
                              index,
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
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium">
                          Preço Unitário *
                        </label>
                        <CurrencyInput
                          value={item.unit_price}
                          onChange={(value) =>
                            handleItemChange(index, "unit_price", value)
                          }
                          required
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium">
                          Subtotal
                        </label>
                        <CurrencyInput
                          value={item.total}
                          onChange={(value) =>
                            handleItemChange(index, "unit_price", value)
                          }
                          required
                          placeholder="R$ 0,00"
                          disabled
                        />
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

              {/* Order Total and Payment */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-end text-lg font-medium">
                  <span>
                    Total:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(total)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">
                      Valor de Entrada
                    </label>
                    <CurrencyInput
                      value={formData.paid_amount || 0}
                      onChange={(value) =>
                        handleInputChange("paid_amount", value)
                      }
                      placeholder="R$ 0,00"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium">
                      Valor Restante
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(total - (formData.paid_amount || 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/orders")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEdit ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
