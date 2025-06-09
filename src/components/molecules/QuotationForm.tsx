import { useState, useEffect, useCallback } from "react";
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
import { Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Quotation } from "@/interfaces/quotation.interface";

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
}

const formSchema = z.object({
  nome: z.string().min(1, { message: "Nome do produto é obrigatório" }),
  categoria: z.string().optional(),
  preco_unitario: z
    .number()
    .min(0.01, { message: "Preço deve ser maior que zero" }),
  quantidade: z
    .number()
    .min(1, { message: "Quantidade deve ser maior que zero" }),
  unidade_medida: z.string().optional(),
  representante: z.string().optional(),
});

type CotacaoFormValues = z.infer<typeof formSchema>;

interface CotacaoFormProps {
  onSubmit: (cotacao: Partial<Quotation>) => void;
  initialData?: Quotation | null;
}

export function QuotationForm({
  onSubmit: handleFormSubmit,
  initialData,
}: CotacaoFormProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const { toast } = useToast();

  const form = useForm<CotacaoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      preco_unitario: 0,
      quantidade: 1,
      unidade_medida: "",
      representante: "",
    },
  });

  const fetchProdutos = useCallback(async () => {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProdutos(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        nome: initialData.nome,
        categoria: initialData.categoria,
        preco_unitario: initialData.preco_unitario,
        quantidade: initialData.quantidade,
        unidade_medida: initialData.unidade_medida,
        representante: initialData.representante,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: CotacaoFormValues) => {
    try {
      const cotacaoData: Partial<Quotation> = {
        ...data,
        preco_total: data.preco_unitario * data.quantidade,
        data_atualizacao: new Date().toISOString(),
      };

      handleFormSubmit(cotacaoData);
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
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="Cosméticos">Cosméticos</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                  <SelectItem value="Suplementos">Suplementos</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="preco_unitario"
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
            name="quantidade"
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
          name="unidade_medida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade de Medida</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="un">Unidade</SelectItem>
                  <SelectItem value="cx">Caixa</SelectItem>
                  <SelectItem value="mg">Miligrama</SelectItem>
                  <SelectItem value="g">Grama</SelectItem>
                  <SelectItem value="ml">Mililitro</SelectItem>
                  <SelectItem value="l">Litro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="representante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Representante</FormLabel>
              <FormControl>
                <Input {...field} />
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
              (form.watch("preco_unitario") || 0) *
                (form.watch("quantidade") || 0)
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
