
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  isCollapsed = false,
  onToggle
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id} className="mb-1">
        <div
          className={cn(
            'sidebar-item sidebar-item-hover px-3 py-2.5 rounded-lg transition-colors duration-200',
            active && 'sidebar-item-active',
            depth > 0 && 'ml-4'
          )}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="flex items-center gap-3 w-full text-left"
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="text-sm flex-1 font-medium">{item.label}</span>
                  <span className={cn('transition-transform text-xs', isExpanded && 'rotate-90')}>
                    ▶
                  </span>
                </>
              )}
            </button>
          ) : (
            <Link to={item.path} className="flex items-center gap-3 w-full">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )}
        </div>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="space-y-1 mt-1">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-sidebar text-sidebar-foreground h-full transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-bold">Superfarma</h1>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Toggle Button */}
      {onToggle && (
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={onToggle}
            className="sidebar-item sidebar-item-hover w-full justify-center px-3 py-2.5 rounded-lg transition-colors duration-200"
          >
            <span className="text-base">{isCollapsed ? '▶' : '◀'}</span>
            {!isCollapsed && <span className="text-sm font-medium ml-3">Minimizar</span>}
          </button>
        </div>
      )}
    </div>
  );
};
