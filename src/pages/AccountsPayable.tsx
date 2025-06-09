
import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { menuItems } from '@/utils/menuItems';

export const AccountsPayable: React.FC = () => {
  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-title font-light text-gray-900">Contas a Pagar</h1>
          <p className="text-body text-gray-600">Gerencie suas contas a pagar</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-body text-gray-500">
            Funcionalidade de contas a pagar em desenvolvimento...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};
