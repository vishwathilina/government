import apiClient from '../api-client';

type ApiResponse<T> = {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
};

export type UtilityStats = {
	utilityType: string;
	activeConnections: number;
	pendingBills: number;
	revenue: number;
};

export type BillingOverview = {
	totalRevenue: number;
	revenueChangePercent: number;
	outstandingAmount: number;
	outstandingCount: number;
	overdueAmount: number;
	overdueCount: number;
	collectionRate: number;
	targetCollectionRate: number;
};

export type DashboardStats = {
	totalCustomers: number;
	customerGrowthPercent: number;
	activeConnections: number;
	connectionsChangePercent: number;
	billsGenerated: number;
	billsChangePercent: number;
	revenueMTD: number;
	revenueChangePercent: number;
	utilityStats: UtilityStats[];
	billingOverview: BillingOverview;
};

export const dashboardApi = {
	getStats: async (): Promise<DashboardStats> => {
		const res = await apiClient.get<ApiResponse<DashboardStats>>('/employees/dashboard/stats');
		if (res.data?.success && res.data.data) return res.data.data;
		throw new Error(res.data?.message || 'Failed to load dashboard stats');
	},
};

