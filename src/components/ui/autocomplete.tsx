"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface AutocompleteOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  emptyMessage = "Nenhuma opção encontrada.",
  searchPlaceholder = "Buscar...",
  className,
  popoverClassName,
  disabled = false,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          const searchStr = `${option.label} ${
            option.subtitle || ""
          }`.toLowerCase();
          return searchStr.includes(query.toLowerCase());
        });

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          type="button"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", popoverClassName)}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange?.(currentValue);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div>
                  <div>{option.label}</div>
                  {option.subtitle && (
                    <div className="text-sm text-muted-foreground">
                      {option.subtitle}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
