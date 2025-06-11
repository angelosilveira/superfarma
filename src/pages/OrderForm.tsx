import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/atoms/CurrencyInput";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import {
  CreateOrderData,
  OrderCategory,
  OrderStatus,
  PaymentStatus,
} from "@/interfaces/order.interface";
import { OrderService } from "@/services/order.service";
import { toast } from "@/components/ui/use-toast";

interface FormOrderItem {
  product_id: string;
  product_name: string;
  category: OrderCategory;
  quantity: number;
  unit_price: number;
  total: number;
}

export const OrderForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateOrderData, "items">>({
    customer: "",
    customer_phone: "",
    delivery_date: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    delivery_notes: "",
    observations: "",
    paid_amount: 0,
  });

  const [items, setItems] = useState<FormOrderItem[]>([]);
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
    field: keyof Omit<CreateOrderData, "items">,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "paid_amount" ? Number(value) || 0 : value,
    }));
  };
  // Add item to the form
  const handleAddItem = (item: FormOrderItem) => {
    setItems([...items, item]);
  };

  // Remove item from the form
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };
  const handleItemChange = (
    index: number,
    field: keyof FormOrderItem,
    value: string | number
  ) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === "category") {
      item.category = value as OrderCategory;
    } else if (field === "quantity" || field === "unit_price") {
      item[field] = Number(value);
    } else {
      item[field as "product_id" | "product_name"] = value as string;
    }

    // Calculate the subtotal for this item
    item.total = item.quantity * item.unit_price;

    newItems[index] = item;
    setItems(newItems);
  };

  const prepareFormData = (): CreateOrderData => {
    // Remove total field from items as it's not needed in the API
    const formItems = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    return {
      ...formData,
      items: formItems,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (items.length === 0) {
        toast({
          title: "Erro",
          description: "É necessário incluir pelo menos um item no pedido",
          variant: "destructive",
        });
        return;
      }

      const orderData = prepareFormData();
      const result = await OrderService.create(orderData);

      if (result) {
        toast({
          title: "Sucesso",
          description: "Pedido criado com sucesso",
        });
        navigate("/orders");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar pedido";
      console.error("Error creating order:", error);
      toast({
        title: "Erro",
        description: errorMessage,
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
                  onClick={() => {
                    const newItem: FormOrderItem = {
                      product_id: "",
                      product_name: "",
                      category: OrderCategory.MEDICAMENTO,
                      unit_price: 0,
                      quantity: 1,
                      total: 0,
                    };
                    newItem.total = newItem.quantity * newItem.unit_price;
                    handleAddItem(newItem);
                  }}
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
                        </label>{" "}
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
                          <option value="">Selecione uma categoria</option>
                          {Object.entries(OrderCategory).map(([key, value]) => (
                            <option key={key} value={value}>
                              {value}
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
                        </label>{" "}
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.total)}
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
