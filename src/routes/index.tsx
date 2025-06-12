import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { Wishlist } from "@/pages/Wishlist";
import { Quotations } from "@/pages/Quotations";
import { AccountsPayable } from "@/pages/AccountsPayable";
import { AccountsReceivable } from "@/pages/AccountsReceivable";
import { Customers } from "@/pages/Customers";
import { CustomerForm } from "@/pages/CustomerForm";
import { CustomerImport } from "@/pages/CustomerImport";
import { Categories } from "@/pages/Categories";
import { CategoryForm } from "@/pages/CategoryForm";
import { Suppliers } from "@/pages/Suppliers";
import { SupplierForm } from "@/pages/SupplierForm";
import { Employees } from "@/pages/Employees";
import { EmployeeForm } from "@/pages/EmployeeForm";
import { CashRegisterPage } from "@/pages/CashRegister";
import { CashRegisterForm } from "@/pages/CashRegisterForm";
import NotFound from "@/pages/NotFound";
import { OrdersPage } from "@/pages/Orders";
import { OrderForm } from "@/pages/OrderForm";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route
          path="/financial/accounts-payable"
          element={<AccountsPayable />}
        />
        <Route
          path="/financial/accounts-receivable"
          element={<AccountsReceivable />}
        />

        {/* Customers */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="/customers/edit/:id" element={<CustomerForm />} />
        <Route path="/customers/import" element={<CustomerImport />} />

        {/* Categories */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/categories/edit/:id" element={<CategoryForm />} />

        {/* Suppliers */}
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/new" element={<SupplierForm />} />
        <Route path="/suppliers/edit/:id" element={<SupplierForm />} />

        {/* Employees */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm />} />

        {/* Cash Register */}
        <Route path="/cash-register" element={<CashRegisterPage />} />
        <Route path="/cash-register/new" element={<CashRegisterForm />} />
        <Route path="/cash-register/edit/:id" element={<CashRegisterForm />} />

        {/* Orders */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<OrderForm />} />
        <Route path="/orders/edit/:id" element={<OrderForm />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
