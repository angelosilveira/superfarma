import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Quotation } from "@/interfaces/quotation.interface";
import { Product } from "@/interfaces/product.interface";
import { Supplier } from "@/interfaces/supplier.interface";

const formSchema = z.object({
  supplier_id: z.string().min(1, { message: "Fornecedor é obrigatório" }),
  product_id: z.string().min(1, { message: "Produto é obrigatório" }),
  price: z.number().min(0.01, { message: "Preço deve ser maior que zero" }),
  quantity: z
    .number()
    .min(1, { message: "Quantidade deve ser maior que zero" }),
  notes: z.string().optional(),
  valid_until: z.date(),
});

type QuotationFormValues = z.infer<typeof formSchema>;

interface QuotationFormProps {
  onSubmit: (quotation: Partial<Quotation>) => void;
  initialData?: Quotation | null;
}

export function QuotationForm({
  onSubmit: handleFormSubmit,
  initialData,
}: QuotationFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
      quantity: 1,
      price: 0,
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchProducts(), fetchSuppliers()]);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Erro ao carregar dados",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };
    loadData();
  }, [toast]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        supplier_id: initialData.supplier_id,
        product_id: initialData.product_id,
        price: initialData.price,
        quantity: initialData.quantity,
        notes: initialData.notes || "",
        valid_until: new Date(initialData.valid_until),
      });
    }
  }, [initialData, form]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) throw error;
    if (data) setProducts(data);
  }

  async function fetchSuppliers() {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    if (error) throw error;
    if (data) setSuppliers(data);
  }

  const onSubmit = async (data: QuotationFormValues) => {
    try {
      const quotationData: Partial<Quotation> = {
        ...data,
        total: data.price * data.quantity,
        status: initialData?.status || "pending",
        valid_until: data.valid_until.toISOString(),
      };

      handleFormSubmit(quotationData);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao salvar cotação",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplier_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fornecedor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Unitário</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="valid_until"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Válido Até</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > new Date(2100, 1, 1)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              (form.watch("price") || 0) * (form.watch("quantity") || 0)
            )}
          </div>
          <Button type="submit">
            <Calculator className="mr-2 h-4 w-4" />
            {initialData ? "Atualizar" : "Salvar"} Cotação
          </Button>
        </div>
      </form>
    </Form>
  );
}
