
import React, { useState } from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        menuItems={menuItems}
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
