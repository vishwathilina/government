import { CreateMeterReadingDto } from './create-meter-reading.dto';
export declare class BulkCreateReadingsDto {
    readings: CreateMeterReadingDto[];
    validateAll?: boolean;
}
