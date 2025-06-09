
export interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
  email?: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  salary?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  position: string;
  phone: string;
  email?: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  salary?: number;
}
