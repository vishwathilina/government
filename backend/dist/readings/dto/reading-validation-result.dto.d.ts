export declare class ReadingValidationResultDto {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    index?: number;
    meterId?: number;
    constructor();
    addError(message: string): void;
    addWarning(message: string): void;
    hasWarnings(): boolean;
}
export declare class BulkValidationResultDto {
    allValid: boolean;
    totalCount: number;
    validCount: number;
    invalidCount: number;
    warningCount: number;
    results: ReadingValidationResultDto[];
    constructor();
    addResult(result: ReadingValidationResultDto): void;
}
