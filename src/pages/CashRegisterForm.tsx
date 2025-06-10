import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Save, ArrowLeft } from "lucide-react";
import { CashRegisterFormData } from "@/interfaces/cash-register.interface";
import { CashRegisterService } from "@/services/cash-register.service";
import { toast } from "@/hooks/use-toast";

export const CashRegisterForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CashRegisterFormData>({
    responsavel: "",
    data: new Date().toISOString().split("T")[0],
    valor_inicial: 0,
    dinheiro: 0,
    pix: 0,
    cartao_credito: 0,
    cartao_debito: 0,
    observacoes: "",
  });

  const [total, setTotal] = useState(0);
  const [diferenca, setDiferenca] = useState(0);

  useEffect(() => {
    const novoTotal =
      Number(formData.dinheiro || 0) +
      Number(formData.pix || 0) +
      Number(formData.cartao_credito || 0) +
      Number(formData.cartao_debito || 0);
    setTotal(novoTotal);
    setDiferenca(novoTotal - Number(formData.valor_inicial || 0));
  }, [formData]);

  const loadCashRegister = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await CashRegisterService.getById(id!);
      setFormData({
        responsavel: data.responsavel,
        data: data.data,
        valor_inicial: data.valor_inicial,
        dinheiro: data.dinheiro,
        pix: data.pix,
        cartao_credito: data.cartao_credito,
        cartao_debito: data.cartao_debito,
        observacoes: data.observacoes || "",
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar fechamento",
        description: "Não foi possível carregar os dados do fechamento.",
        variant: "destructive",
      });
      navigate("/cash-register");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      loadCashRegister();
    }
  }, [id, loadCashRegister]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.responsavel) {
      toast({
        title: "Campo obrigatório",
        description: "O responsável é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      if (isEdit) {
        await CashRegisterService.update(id!, formData);
        toast({
          title: "Fechamento atualizado",
          description: "O fechamento foi atualizado com sucesso.",
        });
      } else {
        await CashRegisterService.create(formData);
        toast({
          title: "Fechamento criado",
          description: "O fechamento foi criado com sucesso.",
        });
      }
      navigate("/cash-register");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o fechamento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleInputChange = (
    field: keyof CashRegisterFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "data"
          ? value
          : [
              "valor_inicial",
              "dinheiro",
              "pix",
              "cartao_credito",
              "cartao_debito",
            ].includes(field)
          ? Number(value) || 0
          : value,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate("/cash-register")}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit
                ? "Editar Fechamento de Caixa"
                : "Novo Fechamento de Caixa"}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit
                ? "Edite o fechamento de caixa"
                : "Registre um novo fechamento de caixa"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Responsável *"
                value={formData.responsavel}
                onChange={(e) =>
                  handleInputChange("responsavel", e.target.value)
                }
                required
              />
              <Input
                label="Data *"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange("data", e.target.value)}
                required
              />
              <Input
                label="Valor Inicial (R$)"
                type="number"
                value={formData.valor_inicial}
                onChange={(e) =>
                  handleInputChange("valor_inicial", e.target.value)
                }
                step="0.01"
                min="0"
              />
              <Input
                label="Dinheiro (R$)"
                type="number"
                value={formData.dinheiro}
                onChange={(e) => handleInputChange("dinheiro", e.target.value)}
                step="0.01"
                min="0"
              />
              <Input
                label="PIX (R$)"
                type="number"
                value={formData.pix}
                onChange={(e) => handleInputChange("pix", e.target.value)}
                step="0.01"
                min="0"
              />
              <Input
                label="Cartão de Crédito (R$)"
                type="number"
                value={formData.cartao_credito}
                onChange={(e) =>
                  handleInputChange("cartao_credito", e.target.value)
                }
                step="0.01"
                min="0"
              />
              <Input
                label="Cartão de Débito (R$)"
                type="number"
                value={formData.cartao_debito}
                onChange={(e) =>
                  handleInputChange("cartao_debito", e.target.value)
                }
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-label text-foreground">
                  Total
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-border rounded-lg text-body">
                  {formatCurrency(total)}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-label text-foreground">
                  Diferença
                </label>
                <div
                  className={`px-3 py-2 border border-border rounded-lg text-body ${
                    diferenca !== 0 ? "bg-red-50 text-red-600" : "bg-gray-50"
                  }`}
                >
                  {formatCurrency(diferenca)}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-label text-foreground">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) =>
                  handleInputChange("observacoes", e.target.value)
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/cash-register")}
              >
                Cancelar
              </Button>
              <Button type="submit" icon={Save} loading={isSaving}>
                {isEdit ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
