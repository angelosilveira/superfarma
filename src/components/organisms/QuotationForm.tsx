import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Calculator } from "lucide-react";
import { Product } from "@/interfaces/product.interface";
import { Supplier } from "@/interfaces/supplier.interface";
import { Quotation } from "@/interfaces/quotation.interface";

interface QuotationFormProps {
  onSubmit: (quotation: Partial<Quotation>) => void;
  initialData?: Partial<Quotation>;
}

export function QuotationForm({ onSubmit, initialData }: QuotationFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState<Partial<Quotation>>({
    price: 0,
    quantity: 1,
    status: "pending",
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("name");
    if (data) setProducts(data);
  }

  async function fetchSuppliers() {
    const { data } = await supabase.from("suppliers").select("*").order("name");
    if (data) setSuppliers(data);
  }

  function handleChange(field: keyof Quotation, value: any) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "price" || field === "quantity") {
        updated.total = (updated.price || 0) * (updated.quantity || 0);
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
            <Label htmlFor="product">Produto</Label>
            <Select
              value={formData.product_id}
              onValueChange={(value) => handleChange("product_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Select
              value={formData.supplier_id}
              onValueChange={(value) => handleChange("supplier_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço Unitário</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ""}
                onChange={(e) =>
                  handleChange("price", parseFloat(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity || ""}
                onChange={(e) =>
                  handleChange("quantity", parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valid_until">Válido Até</Label>
            <Input
              id="valid_until"
              type="date"
              value={formData.valid_until}
              onChange={(e) => handleChange("valid_until", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format((formData.price || 0) * (formData.quantity || 0))}
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
