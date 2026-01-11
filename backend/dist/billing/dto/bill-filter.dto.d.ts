export declare enum BillStatusFilter {
    PAID = "PAID",
    UNPAID = "UNPAID",
    OVERDUE = "OVERDUE",
    PARTIAL = "PARTIAL"
}
export declare class BillFilterDto {
    meterId?: number;
    customerId?: number;
    connectionId?: number;
    search?: string;
    utilityTypeId?: number;
    status?: BillStatusFilter;
    startDate?: Date;
    endDate?: Date;
    isPaid?: boolean;
    isOverdue?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
