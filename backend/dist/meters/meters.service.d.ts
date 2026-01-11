import { Repository } from 'typeorm';
import { Meter } from '../database/entities/meter.entity';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';
export declare class MetersService {
    private readonly meterRepository;
    constructor(meterRepository: Repository<Meter>);
    create(createMeterDto: CreateMeterDto): Promise<Meter>;
    findAll(): Promise<Meter[]>;
    findOne(id: string | number): Promise<Meter>;
    update(id: string | number, updateMeterDto: UpdateMeterDto): Promise<Meter>;
    remove(id: string | number): Promise<void>;
}
