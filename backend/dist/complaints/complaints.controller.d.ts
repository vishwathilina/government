import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintResponseDto, ComplaintFilterDto } from './dto';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    create(createDto: CreateComplaintDto): Promise<{
        success: boolean;
        data: ComplaintResponseDto;
        message: string;
    }>;
    findAll(filters: ComplaintFilterDto): Promise<{
        success: boolean;
        data: ComplaintResponseDto[];
        total: number;
        page: number;
        limit: number;
        message: string;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: ComplaintResponseDto;
        message: string;
    }>;
    update(id: number, updateDto: UpdateComplaintDto): Promise<{
        success: boolean;
        data: ComplaintResponseDto;
        message: string;
    }>;
    assign(id: number, body: {
        employeeId: number;
    }): Promise<{
        success: boolean;
        data: ComplaintResponseDto;
        message: string;
    }>;
    resolve(id: number): Promise<{
        success: boolean;
        data: ComplaintResponseDto;
        message: string;
    }>;
    close(id: number): Promise<{
        success: boolean;
        data: ComplaintResponseDto;
        message: string;
    }>;
}
