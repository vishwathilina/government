import apiClient from '../api-client';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type Employee = {
  employeeId: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  employeeNo: string;
  designation: string;
  role: string;
  departmentId: number;
  email: string;
  username: string;
  lastLoginAt: string | null;
};

export type EmployeesListResponse = {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
};

export type CreateEmployeeDto = {
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeNo: string;
  designation: string;
  role: string;
  departmentId: number;
  email: string;
  username: string;
  password: string;
};

export type UpdateEmployeeDto = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  employeeNo?: string;
  designation?: string;
  role?: string;
  departmentId?: number;
  email?: string;
  username?: string;
  password?: string;
};

export const employeesApi = {
  /**
   * Get paginated list of employees
   */
  getAll: async (page: number = 1, limit: number = 10): Promise<EmployeesListResponse> => {
    const res = await apiClient.get<ApiResponse<ApiResponse<EmployeesListResponse>>>(
      `/employees?page=${page}&limit=${limit}`
    );
    // Handle double-wrapped response from interceptor
    const innerData = res.data?.data;
    if (innerData && 'data' in innerData && innerData.data) {
      return innerData.data as EmployeesListResponse;
    }
    if (res.data?.success && res.data.data) {
      return res.data.data as unknown as EmployeesListResponse;
    }
    throw new Error('Failed to load employees');
  },

  /**
   * Get single employee by ID
   */
  getById: async (id: number): Promise<Employee> => {
    const res = await apiClient.get<ApiResponse<ApiResponse<Employee>>>(`/employees/${id}`);
    // Handle double-wrapped response
    const innerData = res.data?.data;
    if (innerData && 'data' in innerData && innerData.data) {
      return innerData.data as Employee;
    }
    if (res.data?.success && res.data.data) {
      return res.data.data as unknown as Employee;
    }
    throw new Error('Failed to load employee');
  },

  /**
   * Create new employee
   */
  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    const res = await apiClient.post<ApiResponse<Employee>>('/employees', data);
    if (res.data?.success && res.data.data) return res.data.data;
    throw new Error(res.data?.message || 'Failed to create employee');
  },

  /**
   * Update employee
   */
  update: async (id: number, data: UpdateEmployeeDto): Promise<Employee> => {
    const res = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    if (res.data?.success && res.data.data) return res.data.data;
    throw new Error(res.data?.message || 'Failed to update employee');
  },

  /**
   * Delete employee
   */
  delete: async (id: number): Promise<void> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/employees/${id}`);
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'Failed to delete employee');
    }
  },
};
