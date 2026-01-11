"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Shield,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
} from "lucide-react";
import { employeesApi, type Employee, type CreateEmployeeDto, type UpdateEmployeeDto } from "@/lib/api/employees";

// Role badge colors
const roleBadgeColors: Record<string, string> = {
  Admin: "bg-red-100 text-red-800",
  Manager: "bg-purple-100 text-purple-800",
  Supervisor: "bg-blue-100 text-blue-800",
  FieldOfficer: "bg-green-100 text-green-800",
  Cashier: "bg-yellow-100 text-yellow-800",
  MeterReader: "bg-orange-100 text-orange-800",
  default: "bg-gray-100 text-gray-800",
};

const roleOptions = [
  "Admin",
  "Manager",
  "Supervisor",
  "FieldOfficer",
  "Cashier",
  "MeterReader",
];

const departmentOptions = [
  { id: 1, name: "Administration" },
  { id: 2, name: "Operations" },
  { id: 3, name: "Customer Service" },
  { id: 4, name: "Billing" },
  { id: 5, name: "Field Services" },
];

function getRoleBadgeColor(role: string): string {
  return roleBadgeColors[role] || roleBadgeColors.default;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Stats card component
function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <div className={`card p-4 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// Employee row component
function EmployeeRow({
  employee,
  onEdit,
  onDelete,
}: {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.fullName}
            </div>
            <div className="text-sm text-gray-500">{employee.employeeNo}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee.email}</div>
        <div className="text-sm text-gray-500">@{employee.username}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee.designation}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
            employee.role
          )}`}
        >
          <Shield className="h-3 w-3 mr-1" />
          {employee.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {formatDate(employee.lastLoginAt)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(employee)}
          className="text-blue-600 hover:text-blue-900 mr-3"
          title="Edit employee"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(employee)}
          className="text-red-600 hover:text-red-900"
          title="Delete employee"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

// Modal component
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Employee form component
function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  isLoading,
}: {
  employee?: Employee;
  onSubmit: (data: CreateEmployeeDto | UpdateEmployeeDto) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const isEdit = !!employee;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || "",
    middleName: employee?.middleName || "",
    lastName: employee?.lastName || "",
    employeeNo: employee?.employeeNo || "",
    designation: employee?.designation || "",
    role: employee?.role || "FieldOfficer",
    departmentId: Number(employee?.departmentId) || 1,
    email: employee?.email || "",
    username: employee?.username || "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      const updateData: UpdateEmployeeDto = {};
      if (formData.firstName !== employee.firstName) updateData.firstName = formData.firstName;
      if (formData.middleName !== (employee.middleName || "")) updateData.middleName = formData.middleName || undefined;
      if (formData.lastName !== employee.lastName) updateData.lastName = formData.lastName;
      if (formData.employeeNo !== employee.employeeNo) updateData.employeeNo = formData.employeeNo;
      if (formData.designation !== employee.designation) updateData.designation = formData.designation;
      if (formData.role !== employee.role) updateData.role = formData.role;
      if (formData.departmentId !== Number(employee.departmentId)) updateData.departmentId = formData.departmentId;
      if (formData.email !== employee.email) updateData.email = formData.email;
      if (formData.username !== employee.username) updateData.username = formData.username;
      if (formData.password) updateData.password = formData.password;
      onSubmit(updateData);
    } else {
      onSubmit(formData as CreateEmployeeDto);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Middle Name
        </label>
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee No *
          </label>
          <input
            type="text"
            name="employeeNo"
            value={formData.employeeNo}
            onChange={handleChange}
            required
            placeholder="EMP006"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation *
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            placeholder="Senior Engineer"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {departmentOptions.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john.doe@utility.gov"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username *
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="johndoe"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password {!isEdit && "*"}
          {isEdit && <span className="text-gray-500 font-normal ml-1">(leave empty to keep current)</span>}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
            minLength={8}
            placeholder={isEdit ? "••••••••" : "Min 8 characters"}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
          {isEdit ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
}

// Delete confirmation modal
function DeleteConfirmModal({
  isOpen,
  employee,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  employee: Employee | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  if (!isOpen || !employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Employee">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
          <Trash2 className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Are you sure you want to delete this employee?
            </p>
            <p className="text-sm text-red-600 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Employee Details:</p>
          <p className="font-medium">{employee.fullName}</p>
          <p className="text-sm text-gray-500">{employee.email}</p>
          <p className="text-sm text-gray-500">{employee.role}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
            Delete Employee
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchEmployees = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await employeesApi.getAll(page, limit);
      const employeeData = Array.isArray(result.data) ? result.data : [];
      setEmployees(employeeData);
      setTotal(result.total || 0);
      setTotalPages(Math.ceil((result.total || 0) / limit));
      setCurrentPage(result.page || 1);
    } catch (e: any) {
      const errorMsg =
        e?.response?.status === 401
          ? "Please login to view employees"
          : e?.message || "Failed to load employees";
      setError(errorMsg);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(1);
  }, [fetchEmployees]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchEmployees(page);
    }
  };

  const handleRefresh = () => {
    fetchEmployees(currentPage);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (data: CreateEmployeeDto | UpdateEmployeeDto) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await employeesApi.create(data as CreateEmployeeDto);
      setIsCreateModalOpen(false);
      setSuccessMessage("Employee created successfully!");
      fetchEmployees(1);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: CreateEmployeeDto | UpdateEmployeeDto) => {
    if (!selectedEmployee) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await employeesApi.update(Number(selectedEmployee.employeeId), data as UpdateEmployeeDto);
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      setSuccessMessage("Employee updated successfully!");
      fetchEmployees(currentPage);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await employeesApi.delete(Number(selectedEmployee.employeeId));
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      setSuccessMessage("Employee deleted successfully!");
      fetchEmployees(currentPage);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter employees by search term
  const filteredEmployees = (employees || []).filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate role stats
  const roleStats = (employees || []).reduce((acc, emp) => {
    acc[emp.role] = (acc[emp.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeCount = (employees || []).filter((emp) => emp.lastLoginAt).length;
  const inactiveCount = (employees || []).filter((emp) => !emp.lastLoginAt).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600">
            Manage system users and their access permissions
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="card p-4 border border-green-200 bg-green-50">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card p-4 border border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-red-800">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Employees" value={total} icon={Users} iconColor="bg-blue-500" bgColor="bg-blue-50" />
        <StatsCard title="Active Users" value={activeCount} icon={UserCheck} iconColor="bg-green-500" bgColor="bg-green-50" />
        <StatsCard title="Never Logged In" value={inactiveCount} icon={UserX} iconColor="bg-yellow-500" bgColor="bg-yellow-50" />
        <StatsCard title="Admins" value={roleStats["Admin"] || 0} icon={Shield} iconColor="bg-red-500" bgColor="bg-red-50" />
      </div>

      {/* Employees Table */}
      <div className="card">
        <div className="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Employees ({total})</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                      <p className="text-gray-500">Loading employees...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">{searchTerm ? "No employees match your search" : "No employees found"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <EmployeeRow key={employee.employeeId} employee={employee} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Role Distribution */}
      {Object.keys(roleStats).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Role Distribution</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(roleStats).map(([role, count]) => (
                <div key={role} className={`p-4 rounded-lg ${getRoleBadgeColor(role)} bg-opacity-50`}>
                  <p className="text-sm font-medium">{role}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Employee">
        <EmployeeForm onSubmit={handleCreateSubmit} onCancel={() => setIsCreateModalOpen(false)} isLoading={isSubmitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedEmployee(null); }} title="Edit Employee">
        {selectedEmployee && (
          <EmployeeForm employee={selectedEmployee} onSubmit={handleEditSubmit} onCancel={() => { setIsEditModalOpen(false); setSelectedEmployee(null); }} isLoading={isSubmitting} />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employee={selectedEmployee}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setIsDeleteModalOpen(false); setSelectedEmployee(null); }}
        isLoading={isSubmitting}
      />
    </div>
  );
}
