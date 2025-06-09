import { useState } from "react";
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
import { Quotation } from "@/interfaces/quotation.interface";

interface QuotationTableProps {
  quotations: Quotation[];
  onEdit: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
}

export function QuotationTable({
  quotations,
  onEdit,
  onDelete,
  onStatusChange,
}: QuotationTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {status === "pending"
          ? "Pendente"
          : status === "approved"
          ? "Aprovada"
          : "Rejeitada"}
      </Badge>
    );
  };

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
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(quotation.id, "rejected")}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(quotation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(quotation.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
