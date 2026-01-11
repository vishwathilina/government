import { WorkOrder } from './work-order.entity';
import { Item } from './item.entity';
import { Warehouse } from './warehouse.entity';
import { StockTransaction } from './stock-transaction.entity';
export declare class WorkOrderItemUsage {
    workOrderItemUsageId: number;
    workOrderId: number;
    itemId: number;
    warehouseId: number;
    qtyUsed: number;
    unitCostSnapshot: number;
    itemCostAmount: number;
    issuedTs: Date;
    stockTxnId: number | null;
    workOrder: WorkOrder;
    item: Item;
    warehouse: Warehouse;
    stockTransaction: StockTransaction | null;
}
