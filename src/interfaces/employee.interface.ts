export interface Employee {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  data_admissao: string;
  created_at: string;
}

export interface EmployeeFormData {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  data_admissao: string;
}
