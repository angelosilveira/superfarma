
import React from 'react';
import { Badge } from '@/components/atoms/Badge';

interface StatusBadgeProps {
  status: string;
  statusMap?: Record<string, { variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'; label: string }>;
}

const defaultStatusMap = {
  active: { variant: 'success' as const, label: 'Ativo' },
  inactive: { variant: 'danger' as const, label: 'Inativo' },
  pending: { variant: 'warning' as const, label: 'Pendente' },
  completed: { variant: 'success' as const, label: 'Concluído' },
  cancelled: { variant: 'danger' as const, label: 'Cancelado' },
  draft: { variant: 'secondary' as const, label: 'Rascunho' },
  sent: { variant: 'info' as const, label: 'Enviado' },
  received: { variant: 'primary' as const, label: 'Recebido' },
  closed: { variant: 'success' as const, label: 'Fechado' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusMap = defaultStatusMap
}) => {
  const statusConfig = statusMap[status] || { variant: 'secondary' as const, label: status };
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};
