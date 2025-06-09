import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronsUpDown, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Product } from "@/interfaces/product.interface";
import { Quotation } from "@/interfaces/quotation.interface";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuotationFormProps {
  onSubmit: (quotation: Partial<Quotation>) => void;
  initialData?: Partial<Quotation>;
}

export function QuotationForm({ onSubmit, initialData }: QuotationFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [representatives, setRepresentatives] = useState<
    { id: string; nome: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [representativeOpen, setRepresentativeOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Quotation>>({
    preco_unitario: 0,
    quantidade: 1,
    data_atualizacao: new Date().toISOString(),
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [repQuery, setRepQuery] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      if (initialData.produto_id) {
        const product = products.find((p) => p.id === initialData.produto_id);
        if (product) setSelectedProduct(product);
      }
    }
  }, [initialData, products]);

  useEffect(() => {
    fetchProducts();
    fetchRepresentatives();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("produtos").select("*").order("nome");
    if (data) setProducts(data);
  }

  async function fetchRepresentatives() {
    const { data } = await supabase
      .from("representantes")
      .select("id, nome")
      .order("nome");
    if (data) setRepresentatives(data);
  }

  const filteredProducts =
    query === ""
      ? products
      : products.filter(
          (product) =>
            product.nome.toLowerCase().includes(query.toLowerCase()) ||
            (product.codigo || "").toLowerCase().includes(query.toLowerCase())
        );

  const filteredRepresentatives =
    repQuery === ""
      ? representatives
      : representatives.filter((rep) =>
          rep.nome.toLowerCase().includes(repQuery.toLowerCase())
        );

  function handleProductSelect(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setFormData((prev) => ({
        ...prev,
        produto_id: product.id,
        nome: product.nome,
        codigo: product.codigo,
        categoria: product.categoria,
        unidade_medida: product.unidade_medida,
      }));
    }
    setOpen(false);
  }

  function handleChange<T extends keyof Quotation>(
    field: T,
    value: Quotation[T]
  ) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "preco_unitario" || field === "quantidade") {
        updated.preco_total =
          (updated.preco_unitario || 0) * (updated.quantidade || 0);
      }
      return updated;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Cotação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Produto</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedProduct
                    ? selectedProduct.nome
                    : "Selecione um produto..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar produto por nome ou código..."
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.nome}
                        onSelect={() => handleProductSelect(product.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProduct?.id === product.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {product.nome}
                        {product.codigo && (
                          <span className="ml-2 text-sm text-gray-500">
                            (Cód: {product.codigo})
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Representante</Label>
            <Popover
              open={representativeOpen}
              onOpenChange={setRepresentativeOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={representativeOpen}
                  className="w-full justify-between"
                >
                  {formData.representante || "Selecione um representante..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar representante..."
                    value={repQuery}
                    onValueChange={setRepQuery}
                  />
                  <CommandEmpty>Nenhum representante encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredRepresentatives.map((rep) => (
                      <CommandItem
                        key={rep.id}
                        value={rep.nome}
                        onSelect={() => {
                          handleChange("representante", rep.nome);
                          setRepresentativeOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.representante === rep.nome
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {rep.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço Unitário</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_unitario || ""}
                onChange={(e) =>
                  handleChange("preco_unitario", parseFloat(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantidade || ""}
                onChange={(e) =>
                  handleChange("quantidade", parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>

          {selectedProduct?.unidade_medida && (
            <div className="text-sm text-gray-500">
              Unidade de medida: {selectedProduct.unidade_medida}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                (formData.preco_unitario || 0) * (formData.quantidade || 0)
              )}
            </div>
            <Button type="submit">
              <Calculator className="mr-2 h-4 w-4" />
              Salvar Cotação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
