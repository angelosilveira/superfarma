import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Save, ArrowLeft } from "lucide-react";
import { SupplierFormData } from "@/interfaces/supplier.interface";
import { SuppliersService } from "@/services/suppliers.service";
import { useToast } from "@/hooks/use-toast";

export const SupplierForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState<SupplierFormData>({
    nome: "",
    empresa: "",
    contato: "",
    email: "",
  });

  useEffect(() => {
    if (id) {
      loadSupplier();
    }
  }, [id]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      const supplier = await SuppliersService.getById(id!);
      setFormData({
        nome: supplier.nome,
        empresa: supplier.empresa,
        contato: supplier.contato || "",
        email: supplier.email || "",
      });
    } catch (error) {
      console.error("Error loading supplier:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o fornecedor",
        variant: "destructive",
      });
      navigate("/suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await SuppliersService.update(id!, formData);
        toast({
          description: "Fornecedor atualizado com sucesso",
        });
      } else {
        await SuppliersService.create(formData);
        toast({
          description: "Fornecedor criado com sucesso",
        });
      }
      navigate("/suppliers");
    } catch (error) {
      console.error("Error saving supplier:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o fornecedor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SupplierFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate("/suppliers")}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit
                ? "Edite as informações do fornecedor"
                : "Adicione um novo fornecedor"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome *"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
              />
              <Input
                label="Empresa *"
                value={formData.empresa}
                onChange={(e) => handleInputChange("empresa", e.target.value)}
                required
              />
              <Input
                label="Contato"
                value={formData.contato}
                onChange={(e) => handleInputChange("contato", e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/suppliers")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" icon={Save} disabled={loading}>
                {loading
                  ? "Salvando..."
                  : isEdit
                  ? "Salvar Alterações"
                  : "Criar Fornecedor"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
