export declare class UtilityStatsDto {
    utilityType: string;
    activeConnections: number;
    pendingBills: number;
    revenue: number;
}
export declare class BillingOverviewDto {
    totalRevenue: number;
    revenueChangePercent: number;
    outstandingAmount: number;
    outstandingCount: number;
    overdueAmount: number;
    overdueCount: number;
    collectionRate: number;
    targetCollectionRate: number;
}
export declare class DashboardStatsDto {
    totalCustomers: number;
    customerGrowthPercent: number;
    activeConnections: number;
    connectionsChangePercent: number;
    billsGenerated: number;
    billsChangePercent: number;
    revenueMTD: number;
    revenueChangePercent: number;
    utilityStats: UtilityStatsDto[];
    billingOverview: BillingOverviewDto;
}
