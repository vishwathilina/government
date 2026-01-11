import { WorkOrder } from './work-order.entity';
import { Employee } from './employee.entity';
export declare class WorkOrderLabor {
    workOrderLaborId: number;
    workOrderId: number;
    workDate: Date;
    hours: number;
    hourlyRateSnapshot: number;
    workOrder: WorkOrder;
    employees: Employee[];
    get totalCost(): number;
}
