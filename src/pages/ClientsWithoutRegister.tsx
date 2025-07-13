import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Calendar,
  User,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ClientWithoutRegister,
  CreateClientWithoutRegister,
  UpdateClientWithoutRegister,
  PurchaseItemForm,
  ClientsWithoutRegisterFilters,
} from "@/interfaces/clients-without-register.interface";
import { ClientsWithoutRegisterService } from "@/services/clients-without-register.service";

export const ClientsWithoutRegister: React.FC = () => {
  const [clients, setClients] = useState<ClientWithoutRegister[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingClient, setEditingClient] =
    useState<ClientWithoutRegister | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ClientsWithoutRegisterFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Form state
  const [formData, setFormData] = useState<{
    client_name: string;
    purchase_date: string;
    observations: string;
    purchase_items: PurchaseItemForm[];
    total_amount: number;
  }>({
    client_name: "",
    purchase_date: new Date().toISOString().split("T")[0],
    observations: "",
    purchase_items: [
      { product_name: "", quantity: 1, unit_price: 0, total_price: 0 },
    ],
    total_amount: 0,
  });

  useEffect(() => {
    loadClients();
  }, [filters]);

  useEffect(() => {
    calculateTotal();
  }, [formData.purchase_items]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const response = await ClientsWithoutRegisterService.list(filters);
      setClients(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const total = formData.purchase_items.reduce(
      (sum, item) => sum + item.total_price,
      0
    );
    setFormData((prev) => ({ ...prev, total_amount: total }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      purchase_items: [
        ...prev.purchase_items,
        { product_name: "", quantity: 1, unit_price: 0, total_price: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      purchase_items: prev.purchase_items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseItemForm,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      purchase_items: prev.purchase_items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unit_price") {
            updatedItem.total_price =
              updatedItem.quantity * updatedItem.unit_price;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      purchase_date: new Date().toISOString().split("T")[0],
      observations: "",
      purchase_items: [
        { product_name: "", quantity: 1, unit_price: 0, total_price: 0 },
      ],
      total_amount: 0,
    });
    setEditingClient(null);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (editingClient) {
        await ClientsWithoutRegisterService.update(editingClient.id, {
          client_name: formData.client_name,
          purchase_date: formData.purchase_date,
          observations: formData.observations,
          purchase_items: formData.purchase_items,
          total_amount: formData.total_amount,
        });
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso",
        });
      } else {
        await ClientsWithoutRegisterService.create({
          client_name: formData.client_name,
          purchase_date: formData.purchase_date,
          observations: formData.observations,
          purchase_items: formData.purchase_items,
          total_amount: formData.total_amount,
        });
        toast({
          title: "Sucesso",
          description: "Cliente adicionado com sucesso",
        });
      }

      loadClients();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cliente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client: ClientWithoutRegister) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      purchase_date: client.purchase_date,
      observations: client.observations || "",
      purchase_items: client.purchase_items.map((item) => ({
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
      total_amount: client.total_amount,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await ClientsWithoutRegisterService.delete(id);
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso",
      });
      loadClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o cliente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const newFilters: ClientsWithoutRegisterFilters = {};

    if (searchTerm) {
      newFilters.client_name = searchTerm;
    }

    if (dateFilter) {
      newFilters.purchase_date = dateFilter;
    }

    setFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setFilters({});
  };

  const isFormValid = () => {
    return (
      formData.client_name.trim() &&
      formData.purchase_items.length > 0 &&
      formData.purchase_items.every(
        (item) =>
          item.product_name.trim() && item.quantity > 0 && item.unit_price > 0
      )
    );
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Clientes sem Cadastro</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nome do Cliente
                    </label>
                    <Input
                      placeholder="Digite o nome do cliente"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          client_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Data da Compra
                    </label>
                    <Input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          purchase_date: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Produtos</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.purchase_items.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium">
                                Produto
                              </label>
                              <Input
                                placeholder="Nome do produto"
                                value={item.product_name}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "product_name",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Qtd</label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Preço Unit.
                              </label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "unit_price",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <label className="text-sm font-medium">
                                  Total
                                </label>
                                <div className="text-sm font-medium px-3 py-2 bg-muted rounded">
                                  R$ {item.total_price.toFixed(2)}
                                </div>
                              </div>
                              {formData.purchase_items.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Observações</label>
                  <Textarea
                    placeholder="Observações sobre a compra (opcional)"
                    value={formData.observations}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        observations: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded">
                  <span className="text-lg font-medium">Total da Compra:</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {formData.total_amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Cliente</label>
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data da Compra</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={applyFilters}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data da Compra</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {client.client_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(
                            new Date(client.purchase_date),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          <Badge variant="secondary">
                            {client.purchase_items.length} item(s)
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-primary">
                          R$ {client.total_amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {client.observations ? (
                          <div
                            className="max-w-xs truncate"
                            title={client.observations}
                          >
                            {client.observations}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a conta do
                                  cliente "{client.client_name}"? Esta ação não
                                  pode ser desfeita e todos os dados
                                  relacionados serão removidos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(client.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detalhes expandidos */}
        {clients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {clients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {client.client_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(client.purchase_date),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold text-primary">
                          R$ {client.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {client.purchase_items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x R$ {item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              R$ {item.total_price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {client.observations && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-800">
                          Observações:
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          {client.observations}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
