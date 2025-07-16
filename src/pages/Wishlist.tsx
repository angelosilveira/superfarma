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
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
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
import * as XLSX from "xlsx";

// Enum para categorias
export enum WishlistCategory {
  GENERICO = "GENERICO",
  SIMILAR = "SIMILAR",
  ETICO = "ETICO",
  PERFUMARIA = "PERFUMARIA",
  BELEZA = "BELEZA",
  HIGIENE_PESSOAL = "HIGIENE_PESSOAL",
  OUTROS = "OUTROS",
}

// Mapeamento dos labels das categorias
const categoryLabels: Record<WishlistCategory, string> = {
  [WishlistCategory.GENERICO]: "Genérico",
  [WishlistCategory.SIMILAR]: "Similar",
  [WishlistCategory.ETICO]: "Ético",
  [WishlistCategory.PERFUMARIA]: "Perfumaria",
  [WishlistCategory.BELEZA]: "Beleza",
  [WishlistCategory.HIGIENE_PESSOAL]: "Higiene Pessoal",
  [WishlistCategory.OUTROS]: "Outros",
};

// Mapeamento dos labels de status
const statusLabels: Record<WishlistStatus, string> = {
  [WishlistStatus.PENDING]: "Pendente",
  [WishlistStatus.ORDERED]: "Pedido Feito",
  [WishlistStatus.RECEIVED]: "Recebido",
  [WishlistStatus.OUT_OF_STOCK]: "Em Falta",
};

export const Wishlist: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form state
  const [newItem, setNewItem] = useState<CreateWishlistItem>({
    product_name: "",
    observations: "",
    quantity: null,
    status: WishlistStatus.PENDING,
    category: WishlistCategory.GENERICO,
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
        quantity: null, // Resetado sem valor padrão
        status: WishlistStatus.PENDING,
        category: WishlistCategory.GENERICO,
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
      // Adicionar updated_at ao fazer update
      const updatesWithDate = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await WishlistService.update(id, updatesWithDate);
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
          `${item.product_name} - Categoria: ${
            categoryLabels[item.category]
          } - Quantidade: ${item.quantity}${
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
          `${item.product_name} - Categoria: ${
            categoryLabels[item.category]
          } - Quantidade: ${item.quantity}${
            item.observations ? `\nObs: ${item.observations}` : ""
          }\n`
      )
      .join("\n");

    const message = `Lista de produtos em falta:\n\n${text}\nPor favor, poderia me informar a disponibilidade e preços desses itens?`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)));
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Funções de exportação
  const exportToExcel = () => {
    const dataToExport =
      selectedItems.size > 0
        ? items.filter((item) => selectedItems.has(item.id))
        : filteredItems;

    const exportData = dataToExport.map((item) => ({
      Produto: item.product_name,
      Categoria: categoryLabels[item.category],
      Quantidade: item.quantity,
      Status: statusLabels[item.status],
      Observações: item.observations || "",
      "Data de Criação": formatDate(item.created_at),
      "Data de Atualização": formatDate(item.updated_at),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lista de Desejos");
    XLSX.writeFile(
      wb,
      `lista-desejos-${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast({
      title: "Sucesso",
      description: "Arquivo Excel exportado com sucesso",
    });
  };

  const exportToCSV = () => {
    const dataToExport =
      selectedItems.size > 0
        ? items.filter((item) => selectedItems.has(item.id))
        : filteredItems;

    const exportData = dataToExport.map((item) => ({
      Produto: item.product_name,
      Categoria: categoryLabels[item.category],
      Quantidade: item.quantity,
      Status: statusLabels[item.status],
      Observações: item.observations || "",
      "Data de Criação": formatDate(item.created_at),
      "Data de Atualização": formatDate(item.updated_at),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `lista-desejos-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Arquivo CSV exportado com sucesso",
    });
  };

  const exportToJSON = () => {
    const dataToExport =
      selectedItems.size > 0
        ? items.filter((item) => selectedItems.has(item.id))
        : filteredItems;

    const exportData = dataToExport.map((item) => ({
      id: item.id,
      product_name: item.product_name,
      category: item.category,
      category_label: categoryLabels[item.category],
      quantity: item.quantity,
      status: item.status,
      status_label: statusLabels[item.status],
      observations: item.observations,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `lista-desejos-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Sucesso",
      description: "Arquivo JSON exportado com sucesso",
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.observations?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Lista de Desejos</h1>
        </div>

        <div className="space-y-4">
          {/* Add new item form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                value={newItem.quantity || ""}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value) || null,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria
              </label>
              <Select
                value={newItem?.category}
                onValueChange={(value) =>
                  setNewItem((prev) => ({
                    ...prev,
                    category: value as WishlistCategory,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button
                className="w-full"
                onClick={handleAdd}
                disabled={!newItem.product_name || !newItem.quantity}
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
          </div>

          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    disabled={selectedItems.size === 0}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Lista
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={exportToExcel}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Exportar como Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportToCSV}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exportar como CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportToJSON}>
                        <FileJson className="h-4 w-4 mr-2" />
                        Exportar como JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedItems.size === filteredItems.length &&
                        filteredItems.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead>Data Atualização</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      {items.length === 0
                        ? "Nenhum produto na lista de desejos"
                        : "Nenhum produto encontrado para a busca"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                        />
                      </TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{categoryLabels[item.category]}</TableCell>
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
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(item.updated_at)}
                      </TableCell>
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
                        ? { ...prev, quantity: Number(e.target.value) }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Categoria
                </label>
                <Select
                  value={editingItem.category}
                  onValueChange={(value) =>
                    setEditingItem((prev) =>
                      prev
                        ? { ...prev, category: value as WishlistCategory }
                        : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value={WishlistStatus.OUT_OF_STOCK}>
                      Em Falta
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
                      category: editingItem.category,
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
