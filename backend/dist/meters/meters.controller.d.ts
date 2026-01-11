import { MetersService } from './meters.service';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';
export declare class MetersController {
    private readonly metersService;
    constructor(metersService: MetersService);
    create(createMeterDto: CreateMeterDto): Promise<{
        id: any;
        meterNumber: any;
        status: any;
        utilityTypeId: any;
        utilityTypeName: any;
        installationDate: any;
        isSmartMeter: any;
    }>;
    findAll(): Promise<{
        id: any;
        meterNumber: any;
        status: any;
        utilityTypeId: any;
        utilityTypeName: any;
        installationDate: any;
        isSmartMeter: any;
    }[]>;
    findOne(id: string): Promise<{
        id: any;
        meterNumber: any;
        status: any;
        utilityTypeId: any;
        utilityTypeName: any;
        installationDate: any;
        isSmartMeter: any;
    }>;
    update(id: string, updateMeterDto: UpdateMeterDto): Promise<{
        id: any;
        meterNumber: any;
        status: any;
        utilityTypeId: any;
        utilityTypeName: any;
        installationDate: any;
        isSmartMeter: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    private toDto;
}
