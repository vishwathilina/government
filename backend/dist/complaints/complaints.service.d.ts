import { Repository } from 'typeorm';
import { Complaint } from '../database/entities/complaint.entity';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintResponseDto, ComplaintFilterDto } from './dto';
export declare class ComplaintsService {
    private complaintRepository;
    constructor(complaintRepository: Repository<Complaint>);
    create(createDto: CreateComplaintDto): Promise<ComplaintResponseDto>;
    findAll(filters: ComplaintFilterDto): Promise<{
        data: ComplaintResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Complaint>;
    update(id: number, updateDto: UpdateComplaintDto): Promise<ComplaintResponseDto>;
    assign(id: number, employeeId: number): Promise<ComplaintResponseDto>;
    resolve(id: number): Promise<ComplaintResponseDto>;
    close(id: number): Promise<ComplaintResponseDto>;
    private toResponseDto;
}
