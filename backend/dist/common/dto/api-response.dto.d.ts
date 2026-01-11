export declare class ApiResponseDto<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
