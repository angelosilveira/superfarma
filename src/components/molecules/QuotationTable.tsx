import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Edit,
  Copy,
  Trash2,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Package2,
  CircleDollarSign,
  Hash,
  Box,
} from "lucide-react";
import { Cotacao } from "@/interfaces/quotation.interface";
import { cn } from "@/lib/utils";

interface QuotationTableProps {
  cotacoes: Cotacao[];
  onEdit: (cotacao: Cotacao) => void;
  onDelete: (id: string) => void;
  onDuplicate: (cotacao: Cotacao) => void;
}

interface CotacaoPorProduto {
  nome: string;
  cotacoes: Cotacao[];
  menorPreco: number;
}

interface CotacaoPorRepresentante {
  representante: string;
  cotacoes: Cotacao[];
}

export function QuotationTable({
  cotacoes,
  onEdit,
  onDelete,
  onDuplicate,
}: QuotationTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Set<string>>
  >({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Agrupar cotações por produto
  const cotacoesPorProduto = cotacoes.reduce(
    (acc: Record<string, CotacaoPorProduto>, cotacao) => {
      if (!acc[cotacao.nome]) {
        acc[cotacao.nome] = {
          nome: cotacao.nome,
          cotacoes: [],
          menorPreco: Infinity,
        };
      }
      acc[cotacao.nome].cotacoes.push(cotacao);
      acc[cotacao.nome].menorPreco = Math.min(
        acc[cotacao.nome].menorPreco,
        cotacao.preco_unitario
      );
      return acc;
    },
    {}
  );

  // Agrupar cotações por representante (apenas menores preços)
  const cotacoesPorRepresentante = cotacoes.reduce(
    (acc: Record<string, CotacaoPorRepresentante>, cotacao) => {
      if (!acc[cotacao.representante || ""]) {
        acc[cotacao.representante || ""] = {
          representante: cotacao.representante || "",
          cotacoes: [],
        };
      }
      const grupo = cotacoesPorProduto[cotacao.nome];
      if (grupo && cotacao.preco_unitario === grupo.menorPreco) {
        acc[cotacao.representante || ""].cotacoes.push(cotacao);
      }
      return acc;
    },
    {}
  );

  const handleToggleProduct = (representante: string, productId: string) => {
    setSelectedProducts((prev) => {
      const current = new Set(prev[representante] || []);
      if (current.has(productId)) {
        current.delete(productId);
      } else {
        current.add(productId);
      }
      return { ...prev, [representante]: current };
    });
  };

  const handleWhatsappClick = (
    representante: string,
    cotacoesSelecionadas: Cotacao[]
  ) => {
    // Format selected products for WhatsApp message
    const dataFormatada = new Date().toLocaleDateString("pt-BR");
    const mensagem =
      `Olá! Gostaria de fazer um pedido dos seguintes produtos com base nas cotações (${dataFormatada}):\n\n` +
      cotacoesSelecionadas
        .map(
          (c) =>
            `- ${c.nome}\n` +
            `  Quantidade: ${c.quantidade} ${c.unidade_medida || "un"}\n` +
            `  Preço acordado: ${formatCurrency(c.preco_unitario)}\n` +
            `  Total: ${formatCurrency(c.preco_total)}`
        )
        .join("\n\n") +
      `\n\nValor total do pedido: ${formatCurrency(
        cotacoesSelecionadas.reduce((total, c) => total + c.preco_total, 0)
      )}` +
      "\n\nPor favor, confirmar faturamento e disponibilidade dos produtos. Obrigado!";

    // TODO: Replace with actual WhatsApp number from supplier data
    window.open(
      `https://wa.me/5500000000000?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-8">
      {/* Tabela principal de todos os produtos */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cotações por Produto ({cotacoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cotacoes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma cotação cadastrada.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.values(cotacoesPorProduto).map(
                ({ nome, cotacoes: produtoCotacoes, menorPreco }) => (
                  <div key={nome} className="rounded-md border">
                    <div className="bg-gray-50 p-3">
                      <h3 className="text-lg font-semibold">
                        {nome} ({produtoCotacoes.length} cotações)
                      </h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Representante</TableHead>
                          <TableHead className="text-right">
                            Preço Unit.
                          </TableHead>
                          <TableHead className="text-right">Qtd</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead className="text-right">
                            Preço Total
                          </TableHead>
                          <TableHead className="text-right">
                            Diferença
                          </TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produtoCotacoes.map((cotacao) => {
                          const isMenorPreco =
                            cotacao.preco_unitario === menorPreco;
                          const diferenca = (
                            ((cotacao.preco_unitario - menorPreco) /
                              menorPreco) *
                            100
                          ).toFixed(1);

                          return (
                            <TableRow
                              key={cotacao.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                {isMenorPreco ? (
                                  <Badge variant="secondary">Menor Preço</Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{cotacao.representante}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(cotacao.preco_unitario)}
                              </TableCell>
                              <TableCell className="text-right">
                                {cotacao.quantidade}
                              </TableCell>
                              <TableCell>
                                {cotacao.unidade_medida || "un"}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(cotacao.preco_total)}
                              </TableCell>
                              <TableCell className="text-right">
                                {isMenorPreco ? "-" : `${diferenca}% mais caro`}
                              </TableCell>
                              <TableCell>
                                {formatDate(cotacao.data_atualizacao)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(cotacao)}
                                    title="Editar cotação"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDuplicate(cotacao)}
                                    title="Duplicar cotação"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(cotacao.id)}
                                    title="Excluir cotação"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabelas de Melhores Preços por Representante */}
      <div className="space-y-6">
        {Object.entries(cotacoesPorRepresentante).map(
          ([representante, { cotacoes: repCotacoes }]) => (
            <Card key={representante}>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {representante} ({repCotacoes.length} produtos)
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleWhatsappClick(
                        representante,
                        repCotacoes.filter((c) =>
                          selectedProducts[representante]?.has(c.id)
                        )
                      )
                    }
                    disabled={
                      !selectedProducts[representante] ||
                      selectedProducts[representante].size === 0
                    }
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar Pedido
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={
                              selectedProducts[representante]?.size ===
                              repCotacoes.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newSet = new Set(
                                  repCotacoes.map((c) => c.id)
                                );
                                setSelectedProducts((prev) => ({
                                  ...prev,
                                  [representante]: newSet,
                                }));
                              } else {
                                setSelectedProducts((prev) => {
                                  const newState = { ...prev };
                                  delete newState[representante];
                                  return newState;
                                });
                              }
                            }}
                          />
                          Produto
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repCotacoes.map((cotacao) => (
                      <TableRow key={cotacao.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedProducts[representante]?.has(
                                cotacao.id
                              )}
                              onChange={() =>
                                handleToggleProduct(representante, cotacao.id)
                              }
                              className="rounded border-gray-300"
                            />
                            {cotacao.nome}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(cotacao.preco_unitario)}
                        </TableCell>
                        <TableCell className="text-right">
                          {cotacao.quantidade}
                        </TableCell>
                        <TableCell>{cotacao.unidade_medida || "un"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(cotacao.preco_total)}
                        </TableCell>
                        <TableCell>
                          {formatDate(cotacao.data_atualizacao)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDuplicate(cotacao)}
                              title="Duplicar cotação"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(cotacao.id)}
                              title="Excluir cotação"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {repCotacoes.length > 0 && (
                  <div className="p-4 border-t">
                    <div className="text-sm text-right">
                      Total selecionado:{" "}
                      <span className="font-medium">
                        {formatCurrency(
                          repCotacoes
                            .filter((c) =>
                              selectedProducts[representante]?.has(c.id)
                            )
                            .reduce((acc, c) => acc + c.preco_total, 0)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
