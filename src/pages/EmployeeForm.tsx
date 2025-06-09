import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { menuItems } from "@/utils/menuItems";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Save, ArrowLeft } from "lucide-react";
import { EmployeeFormData } from "@/interfaces/employee.interface";
import { EmployeesService } from "@/services/employees.service";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EmployeeForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<EmployeeFormData>({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    data_admissao: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const employee = await EmployeesService.getById(id!);
      setFormData({
        nome: employee.nome,
        email: employee.email,
        telefone: employee.telefone,
        cargo: employee.cargo,
        data_admissao: employee.data_admissao,
      });
    } catch (error) {
      console.error("Error loading employee:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o colaborador",
        variant: "destructive",
      });
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await EmployeesService.update(id!, formData);
        toast({
          description: "Colaborador atualizado com sucesso",
        });
      } else {
        await EmployeesService.create(formData);
        toast({
          description: "Colaborador criado com sucesso",
        });
      }
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o colaborador",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cargos = [
    "Farmacêutico",
    "Atendente",
    "Caixa",
    "Gerente",
    "Administrativo",
  ];

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
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
            onClick={() => navigate("/employees")}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-title font-light text-gray-900">
              {isEdit ? "Editar Colaborador" : "Novo Colaborador"}
            </h1>
            <p className="text-body text-gray-600">
              {isEdit
                ? "Edite as informações do colaborador"
                : "Adicione um novo colaborador"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome *"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <Input
                label="Telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Cargo *
                </label>
                <Select
                  value={formData.cargo}
                  onValueChange={(value) => handleInputChange("cargo", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cargos.map((cargo) => (
                        <SelectItem key={cargo} value={cargo}>
                          {cargo}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Data de Admissão *"
                type="date"
                value={formData.data_admissao}
                onChange={(e) =>
                  handleInputChange("data_admissao", e.target.value)
                }
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/employees")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" icon={Save} disabled={loading}>
                {loading
                  ? "Salvando..."
                  : isEdit
                  ? "Salvar Alterações"
                  : "Criar Colaborador"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
