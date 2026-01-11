import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare enum ReadingSourceDto {
    MANUAL = "MANUAL",
    SMART_METER = "SMART_METER",
    ESTIMATED = "ESTIMATED"
}
export declare class IsNotFutureConstraint implements ValidatorConstraintInterface {
    validate(date: Date): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class CreateMeterReadingDto {
    meterId: number;
    readingDate: Date;
    readingSource: ReadingSourceDto;
    importReading: number;
    exportReading?: number;
    deviceId?: string;
    notes?: string;
    autoGenerateBill?: boolean;
    minDaysBetweenBills?: number;
    dueDaysFromBillDate?: number;
}
