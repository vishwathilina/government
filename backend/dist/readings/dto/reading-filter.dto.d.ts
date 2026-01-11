import { ReadingSourceDto } from './create-meter-reading.dto';
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class ReadingFilterDto {
    meterId?: number;
    meterReaderId?: number;
    readingSource?: ReadingSourceDto;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: SortOrder;
}
