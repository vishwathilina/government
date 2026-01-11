import { ApiProperty } from '@nestjs/swagger';

export class UtilityStatsDto {
	@ApiProperty({ example: 'Water' })
	utilityType: string;

	@ApiProperty({ example: 18543 })
	activeConnections: number;

	@ApiProperty({ example: 2341 })
	pendingBills: number;

	@ApiProperty({ example: 2400000 })
	revenue: number;
}

export class BillingOverviewDto {
	@ApiProperty({ example: 2400000 })
	totalRevenue: number;

	@ApiProperty({ example: 3 })
	revenueChangePercent: number;

	@ApiProperty({ example: 120000 })
	outstandingAmount: number;

	@ApiProperty({ example: 120 })
	outstandingCount: number;

	@ApiProperty({ example: 45000 })
	overdueAmount: number;

	@ApiProperty({ example: 30 })
	overdueCount: number;

	@ApiProperty({ example: 86 })
	collectionRate: number;

	@ApiProperty({ example: 95 })
	targetCollectionRate: number;
}

export class DashboardStatsDto {
	@ApiProperty({ example: 24521 })
	totalCustomers: number;

	@ApiProperty({ example: 12 })
	customerGrowthPercent: number;

	@ApiProperty({ example: 45890 })
	activeConnections: number;

	@ApiProperty({ example: 8 })
	connectionsChangePercent: number;

	@ApiProperty({ example: 12450 })
	billsGenerated: number;

	@ApiProperty({ example: 5 })
	billsChangePercent: number;

	@ApiProperty({ example: 2400000 })
	revenueMTD: number;

	@ApiProperty({ example: 3 })
	revenueChangePercent: number;

	@ApiProperty({ type: [UtilityStatsDto] })
	utilityStats: UtilityStatsDto[];

	@ApiProperty({ type: BillingOverviewDto })
	billingOverview: BillingOverviewDto;
}

