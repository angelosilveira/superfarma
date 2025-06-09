
import React from 'react';
import { Button } from '@/components/atoms/Button';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message,
  size = 'sm',
  className
}) => {
  const handleWhatsAppClick = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleWhatsAppClick}
      className={`bg-green-500 hover:bg-green-600 ${className}`}
    >
      WhatsApp
    </Button>
  );
};
