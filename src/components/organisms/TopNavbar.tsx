
import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TopNavbar: React.FC = () => {
  const [notificationsCount] = useState(3);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between w-full">
      {/* Left side - could be used for breadcrumbs or search */}
      <div className="flex-1">
        {/* Placeholder for future features */}
      </div>

      {/* Right side - Notifications and User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  {notificationsCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-2">Notificações</h3>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded text-sm">
                  <p className="font-medium">Novo pedido recebido</p>
                  <p className="text-gray-600 text-xs">Há 5 minutos</p>
                </div>
                <div className="p-2 bg-green-50 rounded text-sm">
                  <p className="font-medium">Cotação aprovada</p>
                  <p className="text-gray-600 text-xs">Há 1 hora</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded text-sm">
                  <p className="font-medium">Estoque baixo: Paracetamol</p>
                  <p className="text-gray-600 text-xs">Há 2 horas</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">João Silva</p>
              <p className="text-xs text-gray-500">joao.silva@superfarma.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
