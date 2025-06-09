import React, { useState, useEffect } from "react";
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
import { Edit, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { QuotationRequest } from "@/interfaces/quotation.interface";

interface QuotationTableProps {
  quotations: QuotationRequest[];
  onEdit: (quotation: QuotationRequest) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
}

export function QuotationTable({
  quotations,
  onEdit,
  onDelete,
  onStatusChange,
}: QuotationTableProps) {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from("quotation_requests")
        .select(
          `
          *,
          quotations (
            *,
            supplier:suppliers (
              name,
              email,
              phone
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setQuotations(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar cotações",
        description: "Não foi possível carregar a lista de cotações.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: QuotationRequest["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const labels = {
      pending: "Pendente",
      approved: "Aprovada",
      rejected: "Rejeitada",
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("quotation_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setQuotations(quotations.filter((q) => q.id !== id));
      toast({
        title: "Cotação excluída",
        description: "A cotação foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a cotação.",
      });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead className="text-right">Preço Unit.</TableHead>
            <TableHead className="text-right">Qtd.</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Válido Até</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell>{quotation.product?.name}</TableCell>
              <TableCell>{quotation.supplier?.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(quotation.price)}
              </TableCell>
              <TableCell className="text-right">{quotation.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(quotation.total)}
              </TableCell>
              <TableCell>{formatDate(quotation.valid_until)}</TableCell>
              <TableCell>{getStatusBadge(quotation.status)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  {quotation.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(quotation.id, "approved")}
                        title="Aprovar cotação"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(quotation.id, "rejected")}
                        title="Rejeitar cotação"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(quotation)}
                    title="Editar cotação"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(quotation.id)}
                    title="Excluir cotação"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {quotations.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Nenhuma cotação encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
