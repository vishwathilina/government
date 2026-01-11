import apiClient from '../api-client';
import { Bill, BillFilters, BillSummary } from '@/types/bill';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type BillsListResponse = {
  bills: Bill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const billsApi = {
  /**
   * Get paginated list of bills with filters
   */
  getAll: async (filters: BillFilters): Promise<BillsListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.utilityType) params.append('utilityType', filters.utilityType);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.customerId) params.append('customerId', filters.customerId.toString());
    if (filters.connectionId) params.append('connectionId', filters.connectionId.toString());
    if (filters.meterId) params.append('meterId', filters.meterId.toString());
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 25).toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const res = await apiClient.get<BillsListResponse>(`/bills?${params.toString()}`);
    
    // Handle the response - may be wrapped or direct
    const data = res.data;
    if (data && 'bills' in data) {
      return data;
    }
    // If wrapped in ApiResponse
    if ((data as any)?.data && 'bills' in (data as any).data) {
      return (data as any).data;
    }
    
    return {
      bills: [],
      total: 0,
      page: 1,
      limit: 25,
      totalPages: 0,
    };
  },

  /**
   * Get bill summary statistics
   */
  getSummary: async (): Promise<BillSummary> => {
    const res = await apiClient.get<BillSummary | ApiResponse<BillSummary>>('/bills/summary');
    const data = res.data;
    
    // Handle the response
    if ('totalBills' in data) {
      return data as BillSummary;
    }
    if ((data as any)?.data && 'totalBills' in (data as any).data) {
      return (data as any).data;
    }
    
    return {
      totalBills: 0,
      totalAmount: 0,
      totalOutstanding: 0,
      overdueCount: 0,
      paidCount: 0,
      unpaidCount: 0,
    };
  },

  /**
   * Get single bill by ID
   */
  getById: async (id: number): Promise<Bill> => {
    const res = await apiClient.get<Bill | ApiResponse<Bill>>(`/bills/${id}`);
    const data = res.data;
    
    if ('billId' in data) {
      return data as Bill;
    }
    if ((data as any)?.data) {
      return (data as any).data;
    }
    throw new Error('Failed to fetch bill');
  },

  /**
   * Auto-generate bill for a meter
   */
  autoGenerate: async (meterId: number): Promise<Bill> => {
    const res = await apiClient.post<ApiResponse<Bill>>(`/bills/meter/${meterId}/auto-generate`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to generate bill');
  },

  /**
   * Create a new bill
   */
  create: async (data: {
    meterId: number;
    billingPeriodStart: string;
    billingPeriodEnd: string;
  }): Promise<Bill> => {
    const res = await apiClient.post<ApiResponse<Bill>>('/bills', data);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to create bill');
  },

  /**
   * Void a bill
   */
  void: async (id: number): Promise<void> => {
    const res = await apiClient.post<ApiResponse<void>>(`/bills/${id}/void`);
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'Failed to void bill');
    }
  },

  /**
   * Get bill eligibility for a meter
   */
  getEligibility: async (meterId: number): Promise<{
    eligible: boolean;
    reason?: string;
    lastBillDate?: string;
    unbilledReadings?: number;
  }> => {
    const res = await apiClient.get(`/bills/meter/${meterId}/eligibility`);
    return res.data?.data || res.data;
  },

  /**
   * Export bills to CSV
   */
  exportCSV: async (): Promise<Blob> => {
    const res = await apiClient.get('/bills/export', {
      responseType: 'blob',
    });
    return res.data;
  },

  /**
   * Download bill as PDF
   */
  downloadPDF: async (id: number): Promise<Blob> => {
    const res = await apiClient.get(`/bills/${id}/download`, {
      responseType: 'blob',
    });
    return res.data;
  },

  /**
   * Get overdue bills
   */
  getOverdue: async (): Promise<Bill[]> => {
    const res = await apiClient.get<Bill[] | ApiResponse<Bill[]>>('/bills/overdue');
    const data = res.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    if ((data as any)?.data) {
      return (data as any).data;
    }
    return [];
  },
};
