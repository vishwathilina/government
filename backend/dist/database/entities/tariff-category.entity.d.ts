import { UtilityType } from './utility-type.entity';
import { Employee } from './employee.entity';
export declare class TariffCategory {
    tariffCategoryId: number;
    utilityTypeId: number;
    code: string;
    name: string;
    description: string | null;
    isSubsidized: boolean;
    employeeId: number | null;
    utilityType: UtilityType;
    createdBy: Employee | null;
}
