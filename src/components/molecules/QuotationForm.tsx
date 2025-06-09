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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calculator, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Quotation } from "@/interfaces/quotation.interface";
import { cn } from "@/lib/utils";

interface Produto {
  id: string;
  nome: string;
  codigo?: string;
  descricao?: string;
  categoria?: string;
  unidade_medida?: string;
}

interface Representante {
  id: string;
  nome: string;
}

const formSchema = z.object({
  nome: z.string().min(1, { message: "Nome do produto é obrigatório" }),
  codigo: z.string().optional(),
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
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [open, setOpen] = useState(false);
  const [openRepresentante, setOpenRepresentante] = useState(false);
  const [query, setQuery] = useState("");
  const [repQuery, setRepQuery] = useState("");
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

  const fetchRepresentantes = useCallback(async () => {
    const { data, error } = await supabase
      .from("representantes")
      .select("id, nome")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar representantes",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setRepresentantes(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchProdutos();
    fetchRepresentantes();
  }, [fetchProdutos, fetchRepresentantes]);

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

  const filteredProdutos =
    query === ""
      ? produtos
      : produtos.filter(
          (produto) =>
            produto.nome.toLowerCase().includes(query.toLowerCase()) ||
            (produto.codigo || "").toLowerCase().includes(query.toLowerCase())
        );

  const filteredRepresentantes =
    repQuery === ""
      ? representantes
      : representantes.filter((rep) =>
          rep.nome.toLowerCase().includes(repQuery.toLowerCase())
        );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? produtos.find(
                            (produto) => produto.nome === field.value
                          )?.nome
                        : "Selecione um produto..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Buscar produto..."
                      value={query}
                      onValueChange={setQuery}
                    />
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {filteredProdutos.map((produto) => (
                        <CommandItem
                          key={produto.id}
                          value={produto.nome}
                          onSelect={() => {
                            form.setValue("nome", produto.nome);
                            form.setValue("categoria", produto.categoria || "");
                            form.setValue(
                              "unidade_medida",
                              produto.unidade_medida || ""
                            );
                            form.setValue("codigo", produto.codigo || "");
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === produto.nome
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span>{produto.nome}</span>
                          {produto.codigo && (
                            <span className="ml-2 text-sm text-gray-500">
                              (Cód: {produto.codigo})
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <Popover
                open={openRepresentante}
                onOpenChange={setOpenRepresentante}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRepresentante}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? representantes.find((rep) => rep.nome === field.value)
                            ?.nome
                        : "Selecione um representante..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Buscar representante..."
                      value={repQuery}
                      onValueChange={setRepQuery}
                    />
                    <CommandEmpty>
                      Nenhum representante encontrado.
                    </CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {filteredRepresentantes.map((rep) => (
                        <CommandItem
                          key={rep.id}
                          value={rep.nome}
                          onSelect={() => {
                            form.setValue("representante", rep.nome);
                            setOpenRepresentante(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === rep.nome
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
