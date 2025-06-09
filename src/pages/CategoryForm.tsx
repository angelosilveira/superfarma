import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CategoriesService } from "@/services/categories.service";
import { ArrowLeft } from "lucide-react";

export const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const category = await CategoriesService.getById(id!);
      setFormData({
        name: category.nome,
        description: category.descricao || "",
      });
    } catch (error) {
      console.error("Error loading category:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a categoria",
        variant: "destructive",
      });
      navigate("/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (id) {
        await CategoriesService.update(id, formData);
        toast({
          description: "Categoria atualizada com sucesso",
        });
      } else {
        await CategoriesService.create(formData);
        toast({
          description: "Categoria criada com sucesso",
        });
      }
      navigate("/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a categoria",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/categories")}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {id ? "Editar Categoria" : "Nova Categoria"}
            </h1>
            <p className="text-body text-gray-600">
              {id
                ? "Atualize os dados da categoria"
                : "Preencha os dados da nova categoria"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome da categoria"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Descrição
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Digite uma descrição para a categoria"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/categories")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : id ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
