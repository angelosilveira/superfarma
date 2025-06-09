
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Quotations } from '@/pages/Quotations';
import { AccountsPayable } from '@/pages/AccountsPayable';
import { AccountsReceivable } from '@/pages/AccountsReceivable';
import NotFound from '@/pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/financial/accounts-payable" element={<AccountsPayable />} />
        <Route path="/financial/accounts-receivable" element={<AccountsReceivable />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
