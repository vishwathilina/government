import { TariffCategory } from './tariff-category.entity';
export declare class TariffSlab {
    slabId: number;
    tariffCategoryId: number;
    fromUnit: number;
    toUnit: number | null;
    ratePerUnit: number;
    fixedCharge: number;
    unitPrice: number | null;
    validFrom: Date;
    validTo: Date | null;
    tariffCategory: TariffCategory;
    isValid(date?: Date): boolean;
    isInRange(units: number): boolean;
    getUnitsInSlab(totalUnits: number): number;
    calculateSlabCharge(totalUnits: number): number;
}
