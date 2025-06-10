import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  className,
  ...props
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = Number(rawValue) / 100;
    onChange(numberValue);
  };

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return (
    <Input
      {...props}
      type="text"
      value={formattedValue}
      onChange={handleChange}
      className={className}
    />
  );
}
