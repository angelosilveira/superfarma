import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';

export const Dashboard: React.FC = () => {
  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-title text-foreground mb-2">Dashboard</h1>
          <p className="text-body text-muted-foreground">
            Visão geral do seu negócio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-muted-foreground">Vendas Hoje</p>
                <p className="text-section font-bold text-primary">R$ 2.450,00</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-muted-foreground">Pedidos</p>
                <p className="text-section font-bold text-secondary">23</p>
              </div>
              <div className="text-2xl">🛒</div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-muted-foreground">Produtos</p>
                <p className="text-section font-bold text-dark">1.245</p>
              </div>
              <div className="text-2xl">💊</div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-muted-foreground">Clientes</p>
                <p className="text-section font-bold text-primary">892</p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-subtitle font-semibold mb-4">Vendas da Semana</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de vendas será implementado aqui
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-subtitle font-semibold mb-4">Produtos Mais Vendidos</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Lista de produtos será implementada aqui
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-subtitle font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-body">Nova venda realizada - Pedido #1234</p>
                <p className="text-sm text-muted-foreground">Há 5 minutos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-body">Produto adicionado ao estoque - Dipirona 500mg</p>
                <p className="text-sm text-muted-foreground">Há 15 minutos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-body">Cliente cadastrado - Maria Silva</p>
                <p className="text-sm text-muted-foreground">Há 30 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
