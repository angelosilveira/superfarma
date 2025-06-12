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
import { Checkbox } from "@/components/ui/checkbox";
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
  Copy,
  Edit2,
  MoreHorizontal,
  Plus,
  Trash2,
  MessageCircle as WhatsappIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WishlistItem,
  WishlistStatus,
  CreateWishlistItem,
  UpdateWishlistItem,
} from "@/interfaces/wishlist.interface";
import { WishlistService } from "@/services/wishlist.service";

export const Wishlist: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [newItem, setNewItem] = useState<CreateWishlistItem>({
    product_name: "",
    observations: "",
    quantity: 1,
    status: WishlistStatus.PENDING,
  });

  useEffect(() => {
    loadItems();
  }, []);
  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await WishlistService.list();
      // Filter out received items
      setItems(data.filter((item) => item.status !== WishlistStatus.RECEIVED));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens da lista de desejos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setIsLoading(true);
      await WishlistService.create(newItem);
      toast({
        title: "Sucesso",
        description: "Item adicionado à lista de desejos",
      });
      loadItems();
      setNewItem({
        product_name: "",
        observations: "",
        quantity: 1,
        status: WishlistStatus.PENDING,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: UpdateWishlistItem) => {
    try {
      setIsLoading(true);
      await WishlistService.update(id, updates);
      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso",
      });
      loadItems();
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await WishlistService.delete(id);
      toast({
        title: "Sucesso",
        description: "Item removido com sucesso",
      });
      loadItems();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (status: WishlistStatus) => {
    try {
      setIsLoading(true);
      await WishlistService.updateBulkStatus(Array.from(selectedItems), status);
      toast({
        title: "Sucesso",
        description: "Status atualizado para os itens selecionados",
      });
      loadItems();
      setSelectedItems(new Set());
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os itens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsLoading(true);
      const selectedIds = Array.from(selectedItems);
      await Promise.all(selectedIds.map((id) => WishlistService.delete(id)));
      toast({
        title: "Sucesso",
        description: "Itens removidos com sucesso",
      });
      loadItems();
      setSelectedItems(new Set());
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover os itens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const selectedWishlistItems = items.filter((item) =>
      selectedItems.has(item.id)
    );

    const text = selectedWishlistItems
      .map(
        (item) =>
          `${item.product_name} - Quantidade: ${item.quantity}${
            item.observations ? `\nObs: ${item.observations}` : ""
          }\n`
      )
      .join("\n");

    const message = `Lista de produtos:\n\n${text}\nPor favor, poderia me informar a disponibilidade e preços desses itens?`;

    navigator.clipboard.writeText(message);
    toast({
      title: "Sucesso",
      description: "Lista copiada para a área de transferência",
    });
  };

  const shareOnWhatsApp = () => {
    const selectedWishlistItems = items.filter((item) =>
      selectedItems.has(item.id)
    );

    const text = selectedWishlistItems
      .map(
        (item) =>
          `${item.product_name} - Quantidade: ${item.quantity}${
            item.observations ? `\nObs: ${item.observations}` : ""
          }\n`
      )
      .join("\n");

    const message = `Lista de produtos em falta:\n\n${text}\nPor favor, poderia me informar a disponibilidade e preços desses itens?`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };
  const toggleSelectItem = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  const filteredItems = items.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.observations?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Lista de Desejos</h1>
        </div>

        <div className="space-y-4">
          {" "}
          {/* Add new item form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium">
                Nome do produto
              </label>
              <Input
                id="product-name"
                placeholder="Digite o nome do produto"
                value={newItem.product_name}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    product_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantidade
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Digite a quantidade"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value) || 1,
                  }))
                }
              />
            </div>
            <div className="space-y-2 flex items-end">
              <Button
                className="w-full"
                onClick={handleAdd}
                disabled={!newItem.product_name}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="observations" className="text-sm font-medium">
              Observações
            </label>
            <Textarea
              id="observations"
              placeholder="Digite as observações (opcional)"
              value={newItem.observations || ""}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  observations: e.target.value,
                }))
              }
            />
          </div>{" "}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  {selectedItems.size > 0 && (
                    <>
                      <Select
                        onValueChange={(value) =>
                          handleBulkStatusUpdate(value as WishlistStatus)
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Alterar status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={WishlistStatus.PENDING}>
                            Pendente
                          </SelectItem>
                          <SelectItem value={WishlistStatus.ORDERED}>
                            Pedido Feito
                          </SelectItem>
                          <SelectItem value={WishlistStatus.RECEIVED}>
                            Recebido
                          </SelectItem>
                          <SelectItem value={WishlistStatus.OUT_OF_STOCK}>
                            Em Falta
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir Selecionados
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar exclusão em massa
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir{" "}
                              {selectedItems.size} item(s)? Esta ação não pode
                              ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkDelete}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={items.length === 0}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Lista
                  </Button>
                </div>
              </div>
            </div>
            <Table>
              {" "}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.size === items.length}
                      onClick={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {" "}
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {items.length === 0
                        ? "Nenhum produto na lista de desejos"
                        : "Nenhum produto encontrado para a busca"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      {" "}
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onClick={() => toggleSelectItem(item.id)}
                        />
                      </TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            handleUpdate(item.id, {
                              status: value as WishlistStatus,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={WishlistStatus.OUT_OF_STOCK}>
                              Em Falta
                            </SelectItem>
                            <SelectItem value={WishlistStatus.PENDING}>
                              Pendente
                            </SelectItem>
                            <SelectItem value={WishlistStatus.ORDERED}>
                              Pedido Feito
                            </SelectItem>
                            <SelectItem value={WishlistStatus.RECEIVED}>
                              Recebido
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{item.observations || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingItem(item);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este item?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="edit-product-name"
                  className="text-sm font-medium"
                >
                  Nome do produto
                </label>
                <Input
                  id="edit-product-name"
                  placeholder="Digite o nome do produto"
                  value={editingItem.product_name}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, product_name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-quantity" className="text-sm font-medium">
                  Quantidade
                </label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="1"
                  placeholder="Digite a quantidade"
                  value={editingItem.quantity}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev
                        ? { ...prev, quantity: parseInt(e.target.value) || 1 }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-observations"
                  className="text-sm font-medium"
                >
                  Observações
                </label>
                <Textarea
                  id="edit-observations"
                  placeholder="Digite as observações (opcional)"
                  value={editingItem.observations || ""}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, observations: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={editingItem.status}
                  onValueChange={(value) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, status: value as WishlistStatus } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={WishlistStatus.PENDING}>
                      Pendente
                    </SelectItem>
                    <SelectItem value={WishlistStatus.ORDERED}>
                      Pedido Feito
                    </SelectItem>
                    <SelectItem value={WishlistStatus.RECEIVED}>
                      Recebido
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    setIsDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() =>
                    handleUpdate(editingItem.id, {
                      product_name: editingItem.product_name,
                      quantity: editingItem.quantity,
                      observations: editingItem.observations,
                      status: editingItem.status,
                    })
                  }
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
