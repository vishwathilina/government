export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
export declare class PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    meta: PaginationMeta;
}
