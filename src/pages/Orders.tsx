import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { DataTable } from "@/components/organisms/DataTable";
import { Badge } from "@/components/atoms/Badge";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/interfaces/order.interface";
import { OrderService } from "@/services/order.service";
import { toast } from "@/hooks/use-toast";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: Order) => React.ReactNode;
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await OrderService.getAll();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) {
      return;
    }

    try {
      await OrderService.delete(id);
      toast({
        title: "Pedido excluído",
        description: "O pedido foi excluído com sucesso.",
      });
      loadOrders();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o pedido.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsDelivered = async (id: string) => {
    try {
      await OrderService.updateStatus(id, OrderStatus.DELIVERED);
      toast({
        title: "Pedido atualizado",
        description: "O pedido foi marcado como entregue.",
      });
      loadOrders();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status do pedido.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      [OrderStatus.PENDING]: "warning",
      [OrderStatus.PROCESSING]: "info",
      [OrderStatus.DELIVERED]: "success",
      [OrderStatus.CANCELLED]: "danger",
    } as const;

    const labels = {
      [OrderStatus.PENDING]: "Pendente",
      [OrderStatus.PROCESSING]: "Em Processamento",
      [OrderStatus.DELIVERED]: "Entregue",
      [OrderStatus.CANCELLED]: "Cancelado",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variants = {
      [PaymentStatus.PENDING]: "warning",
      [PaymentStatus.PARTIAL]: "info",
      [PaymentStatus.PAID]: "success",
      [PaymentStatus.CANCELLED]: "danger",
    } as const;

    const labels = {
      [PaymentStatus.PENDING]: "Pendente",
      [PaymentStatus.PARTIAL]: "Parcial",
      [PaymentStatus.PAID]: "Pago",
      [PaymentStatus.CANCELLED]: "Cancelado",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleWhatsAppMessage = (order: Order) => {
    const message = OrderService.formatWhatsAppMessage(order);
    window.open(
      `https://wa.me/${order.customer_phone}?text=${message}`,
      "_blank"
    );
  };

  const columns: Column[] = [
    {
      key: "customer",
      label: "Cliente",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Data",
      render: (order) => new Date(order.created_at).toLocaleDateString("pt-BR"),
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (order) => getStatusBadge(order.status),
    },
    {
      key: "total_amount",
      label: "Valor Total",
      render: (order) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(order.total_amount),
    },
    {
      key: "payment_status",
      label: "Status Pagamento",
      render: (order) => getPaymentStatusBadge(order.payment_status),
    },
    {
      key: "actions",
      label: "Ações",
      render: (order) => (
        <div className="flex gap-2">
          <Link to={`/orders/edit/${order.id}`}>
            <Button variant="ghost" size="sm" icon={Pencil}>
              Editar
            </Button>
          </Link>

          {order.status !== OrderStatus.DELIVERED && (
            <Button
              variant="ghost"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleMarkAsDelivered(order.id)}
            >
              Entregue
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            icon={MessageCircle}
            onClick={() => handleWhatsAppMessage(order)}
          >
            WhatsApp
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(order.id)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-title font-light text-gray-900">Pedidos</h1>
            <p className="text-body text-gray-600">
              Gerencie os pedidos dos clientes
            </p>
          </div>
          <Link to="/orders/new">
            <Button icon={Plus}>Novo Pedido</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <DataTable data={orders} columns={columns} loading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
};
