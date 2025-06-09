
import React from 'react';
import { Home, Package, FileText, ShoppingCart, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: <Home />
  },
  {
    id: 'products',
    label: 'Produtos',
    path: '/products',
    icon: <Package />
  },
  {
    id: 'quotations',
    label: 'Cotações',
    path: '/quotations',
    icon: <FileText />
  },
  {
    id: 'orders',
    label: 'Pedidos',
    path: '/orders',
    icon: <ShoppingCart />
  },
  {
    id: 'financial',
    label: 'Financeiro',
    path: '/financial',
    icon: <DollarSign />,
    children: [
      {
        id: 'accounts-payable',
        label: 'Contas a Pagar',
        path: '/financial/accounts-payable',
        icon: <CreditCard />
      },
      {
        id: 'accounts-receivable',
        label: 'Contas a Receber',
        path: '/financial/accounts-receivable',
        icon: <TrendingUp />
      }
    ]
  }
];
