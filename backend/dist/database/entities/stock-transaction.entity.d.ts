export declare class StockTransaction {
    stockTxnId: number;
    itemId: number;
    warehouseId: number;
    transactionType: string;
    quantity: number;
    transactionDate: Date;
    workOrderItemUsageId: number | null;
}
