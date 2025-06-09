import React from 'react';
import { Home, Package, FileText, ShoppingCart, DollarSign, CreditCard, TrendingUp, Users, Tags, Truck, UserCheck, Calculator } from 'lucide-react';

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
    id: 'customers',
    label: 'Clientes',
    path: '/customers',
    icon: <Users />
  },
  {
    id: 'categories',
    label: 'Categorias',
    path: '/categories',
    icon: <Tags />
  },
  {
    id: 'suppliers',
    label: 'Fornecedores',
    path: '/suppliers',
    icon: <Truck />
  },
  {
    id: 'employees',
    label: 'Colaboradores',
    path: '/employees',
    icon: <UserCheck />
  },
  {
    id: 'cash-register',
    label: 'Caixa',
    path: '/cash-register',
    icon: <Calculator />
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
